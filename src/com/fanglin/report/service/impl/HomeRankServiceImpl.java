package com.fanglin.report.service.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.common.vo.TopVO;
import com.fanglin.report.dao.HomeRankDao;
import com.fanglin.report.service.HomeRankService;

/**
 * 首页排名服务实现。
 *
 * <p>聚合结果按 company+type+month 进程内缓存 5 分钟：首页访问频率高而榜单变化频率低，
 * 缓存把每次页面打开的跨库聚合收敛为低频查询。
 */
@Service("homeRankService")
public class HomeRankServiceImpl implements HomeRankService {

	private static final int TOP = 10;

	private static final long CACHE_TTL = 5 * 60 * 1000L;

	private static final long TEN_THOUSAND = 10000000L;

	@Autowired
	private HomeRankDao homeRankDao;

	private final Map<String, CacheBox> caches = new ConcurrentHashMap<String, CacheBox>();

	@Override
	@Transactional(rollbackFor = Exception.class)
	public List<TopVO> queryHomeRankForTop(Short type, Integer month, int company) {

		short rankType = type == null ? TYPE_DESIGNER_INT : type;
		int rankMonth = month == null ? currentMonth() : month;

		String key = company + ":" + rankType + ":" + rankMonth;

		CacheBox cache = caches.get(key);
		if (cache != null && System.currentTimeMillis() - cache.at < CACHE_TTL) {
			return cache.tops;
		}

		List<TopVO> tops;
		if (rankType == TYPE_SUPERVISOR_INT) {
			tops = toTops(homeRankDao.querySupervisorSiteRankForTop(pastYear(), TOP, company), false);
		} else {
			tops = rankType == TYPE_SALESMAN_INT
					? toTops(homeRankDao.querySalesmanSignRankForTop(monthStartTime(rankMonth), monthEndTime(rankMonth), TOP, company), true)
					: toTops(homeRankDao.queryDesignerSignRankForTop(monthStartTime(rankMonth), monthEndTime(rankMonth), TOP, company), true);
		}

		caches.put(key, new CacheBox(System.currentTimeMillis(), tops));

		return tops;
	}

	private List<TopVO> toTops(List<Object[]> rows, boolean amount) {

		List<TopVO> tops = new ArrayList<TopVO>();

		for (Object[] row : rows) {

			TopVO top = new TopVO();
			top.setTopId((String) row[0]);
			top.setTopName((String) row[1]);
			top.setTopImg(row[2] == null ? "" : (String) row[2]);
			top.setTopValue(amount
					? BigDecimal.valueOf((Long) row[3]).divide(BigDecimal.valueOf(TEN_THOUSAND), 2, RoundingMode.HALF_UP).floatValue()
					: ((Number) row[3]).floatValue());

			tops.add(top);
		}

		return tops;
	}

	private int currentMonth() {

		Calendar calendar = Calendar.getInstance();

		return calendar.get(Calendar.YEAR) * 100 + calendar.get(Calendar.MONTH) + 1;
	}

	private String monthStartTime(int month) {
		return String.format("%04d-%02d-01", month / 100, month % 100);
	}

	private String monthEndTime(int month) {

		int year = month / 100;
		int mon = month % 100;

		if (mon == 12) {
			year++;
			mon = 1;
		} else {
			mon++;
		}

		return String.format("%04d-%02d-01", year, mon);
	}

	private String pastYear() {

		Calendar calendar = Calendar.getInstance();
		calendar.add(Calendar.YEAR, -1);

		return new SimpleDateFormat("yyyy-MM-dd").format(calendar.getTime());
	}

	private static class CacheBox {

		private final long at;

		private final List<TopVO> tops;

		private CacheBox(long at, List<TopVO> tops) {
			this.at = at;
			this.tops = tops;
		}
	}

}
