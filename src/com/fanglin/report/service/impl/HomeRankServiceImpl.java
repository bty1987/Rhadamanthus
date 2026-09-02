package com.fanglin.report.service.impl;

import java.util.Calendar;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.FutureTask;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fanglin.common.vo.TopVO;
import com.fanglin.report.service.HomeRankService;

/**
 * 首页排名服务实现：结果缓存 + single-flight 查询去重。
 *
 * <p>本类不开启事务：并发冷启动同一 key 时仅一个请求真正执行聚合查询（事务在
 * {@link HomeRankLoader} 内短暂开启），其余请求等待复用其结果，等待期间不占用数据库连接。
 * <p>查询失败不缓存结果且在途任务即时出队，下一个请求重新发起查询。
 */
@Service("homeRankService")
public class HomeRankServiceImpl implements HomeRankService {

	private static final long CACHE_TTL = 5 * 60 * 1000L;

	@Autowired
	private HomeRankLoader homeRankLoader;

	private final Map<String, CacheEntry> caches = new ConcurrentHashMap<String, CacheEntry>();

	private final Map<String, FutureTask<List<TopVO>>> inflights = new ConcurrentHashMap<String, FutureTask<List<TopVO>>>();

	@Override
	public List<TopVO> queryHomeRankForTop(Short type, Integer month, int company) {

		short rankType = type == null ? TYPE_DESIGNER_INT : type;
		int rankMonth = month == null ? currentMonth() : month;

		final String key = company + ":" + rankType + ":" + rankMonth;
		final short finalType = rankType;
		final int finalMonth = rankMonth;
		final int finalCompany = company;

		CacheEntry entry = caches.get(key);
		if (entry != null && System.currentTimeMillis() - entry.at < CACHE_TTL) {
			return entry.tops;
		}

		FutureTask<List<TopVO>> task = new FutureTask<List<TopVO>>(new java.util.concurrent.Callable<List<TopVO>>() {

			public List<TopVO> call() {

				List<TopVO> tops = homeRankLoader.queryHomeRankForTop(finalType, finalMonth, finalCompany);

				caches.put(key, new CacheEntry(System.currentTimeMillis(), tops));

				return tops;
			}
		});

		FutureTask<List<TopVO>> running = inflights.putIfAbsent(key, task);

		if (running == null) { // 本请求为执行者,同步执行并承担事务开销

			running = task;

			try {
				running.run();
			} finally {
				inflights.remove(key, task);
			}
		}

		return await(key, running);
	}

	private List<TopVO> await(String key, FutureTask<List<TopVO>> task) {

		try {
			return task.get();
		} catch (ExecutionException e) {

			// 执行者失败:等待者收到同一异常,结果不落缓存,在途任务已由执行者出队,下个请求重试
			Throwable cause = e.getCause() == null ? e : e.getCause();

			if (cause instanceof RuntimeException) {
				throw (RuntimeException) cause;
			}

			if (cause instanceof Error) {
				throw (Error) cause;
			}

			throw new IllegalStateException(cause);
		} catch (InterruptedException e) {
			Thread.currentThread().interrupt();
			throw new IllegalStateException("home rank query interrupted", e);
		}
	}

	private int currentMonth() {

		Calendar calendar = Calendar.getInstance();

		return calendar.get(Calendar.YEAR) * 100 + calendar.get(Calendar.MONTH) + 1;
	}

	private static class CacheEntry {

		private final long at;

		private final List<TopVO> tops;

		private CacheEntry(long at, List<TopVO> tops) {
			this.at = at;
			this.tops = tops;
		}
	}

}
