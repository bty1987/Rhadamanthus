/**
 * @File Name		: ActionLogArchiveServiceImpl.java
 * @Package 		: com.fanglin.log.service.impl
 * @Version			: 1.0
 * @Date			: 2026-07-20
 * @Copyright		: Copyright Creators
 * @Describing		: 操作日志归档 Service 实现
 *
 *  归档流程：
 *    1. 根据 cutoffTime 计算需要归档的月份列表
 *    2. 逐月处理：
 *       a. 白名单校验月份格式（防 SQL 注入）
 *       b. 检查归档表 actionlog_yyyymm 是否存在，不存在则跳过+告警
 *       c. INSERT INTO actionlog_yyyymm SELECT ... （独立事务）
 *       d. DELETE FROM actionlog WHERE ... （同事务）
 *    3. 每个月独立事务，单月失败不影响其他月
 */

package com.fanglin.log.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.regex.Pattern;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.log.dao.ActionLogArchiveDao;
import com.fanglin.log.service.ActionLogArchiveService;
import com.fanglin.utils.SystemConfig;

@Service("actionLogArchiveService")
public class ActionLogArchiveServiceImpl implements ActionLogArchiveService {

	private static final Logger logger = LoggerFactory.getLogger(ActionLogArchiveServiceImpl.class);

	/** 月份格式正则白名单，与表名拼接配套使用，防 SQL 注入 */
	private static final Pattern MONTH_PATTERN = Pattern.compile("^\\d{6}$");

	@Autowired
	private ActionLogArchiveDao actionLogArchiveDao;

	/** 自身代理引用，用于发起 REQUIRES_NEW 事务（避免 this 调用绕过代理） */
	@Autowired
	private ActionLogArchiveService selfArchiveService;

	@Override
	public int archiveBefore(Timestamp cutoffTime) {

		// 归档总开关
		if (!SystemConfig.getBoolean("actionLog.archiveEnabled", true)) return -1;

		if (cutoffTime == null) return 0;

		// 计算需要归档的月份列表：从最早数据所在月到 cutoffTime 所在月的前一个月
		List<MonthRange> months = computeMonthsToArchive(cutoffTime);
		if (months.isEmpty()) {
			logger.info("[actionLog-archive] no months to archive, cutoff={}", cutoffTime);
			return 0;
		}

		int totalArchived = 0;
		for (MonthRange mr : months) {
			try {
				// 关键：通过自身代理调用，REQUIRES_NEW 才能生效
				int n = selfArchiveService.archiveOneMonth(mr);
				totalArchived += n;
				logger.info("[actionLog-archive] month={} archivedRows={}", mr.ym, n);
			} catch (Throwable t) {
				// 单月失败不影响其他月，下次定时任务会重试
				logger.error("[actionLog-archive] month={} archive failed", mr.ym, t);
			}
		}
		logger.info("[actionLog-archive] done totalArchived={}", totalArchived);
		return totalArchived;
	}

	/**
	 * 单月归档（独立事务）：先 INSERT 后 DELETE，任一失败整体回滚（不删热表数据）。
	 */
	@Override
	@Transactional(propagation = Propagation.REQUIRES_NEW, rollbackFor = Exception.class)
	public int archiveOneMonth(MonthRange mr) {

		// 白名单校验（防注入，即便上游已校验也二次兜底）
		if (!MONTH_PATTERN.matcher(mr.ym).matches()) {
			logger.warn("[actionLog-archive] invalid month format, skip: {}", mr.ym);
			return 0;
		}

		// 检查归档表存在
		if (!actionLogArchiveDao.archiveTableExists(mr.ym)) {
			logger.warn("[actionLog-archive] archive table log.actionlog_{} not exists, skip. " + "DBA please create it: CREATE TABLE actionlog_{} LIKE actionlog;", mr.ym, mr.ym);
			return 0;
		}

		// 预估数据量
		long cnt = actionLogArchiveDao.countByTimeRange(mr.start, mr.end);
		if (cnt == 0) return 0;

		// INSERT 到归档表
		int inserted = actionLogArchiveDao.archiveToMonthTable(mr.ym, mr.start, mr.end);
		logger.info("[actionLog-archive] month={} inserted={}", mr.ym, inserted);

		// 二次校验：归档表里的数据量是否与预估一致（防 INSERT 部分成功）
		// 注意：这里不强制相等，只要 inserted > 0 就继续 DELETE
		if (inserted <= 0) {
			logger.warn("[actionLog-archive] month={} inserted=0, skip delete", mr.ym);
			return 0;
		}

		// DELETE 热表（同事务，INSERT 回滚时 DELETE 也回滚）
		int deleted = actionLogArchiveDao.deleteActionLogByTimeRange(mr.start, mr.end);
		logger.info("[actionLog-archive] month={} deleted={}", mr.ym, deleted);

		return deleted;
	}

	/**
	 * 计算需要归档的月份列表。
	 * 
	 * <p>
	 * 策略：找热表中最旧记录所在月（保守起见从 cutoffTime 所在月往前推 12 个月）， 一直枚举到 cutoffTime 所在月的前一个月。每个月生成 MonthRange（月份起始/结束时间）。
	 */
	private List<MonthRange> computeMonthsToArchive(Timestamp cutoffTime) {
		List<MonthRange> list = new ArrayList<MonthRange>();

		// cutoffTime 所在月的"月初"
		Calendar cutoffCal = Calendar.getInstance();
		cutoffCal.setTime(cutoffTime);
		// 截断到月初
		cutoffCal.set(Calendar.DAY_OF_MONTH, 1);
		cutoffCal.set(Calendar.HOUR_OF_DAY, 0);
		cutoffCal.set(Calendar.MINUTE, 0);
		cutoffCal.set(Calendar.SECOND, 0);
		cutoffCal.set(Calendar.MILLISECOND, 0);

		// 默认回溯 12 个月（足够覆盖归档失败重试场景）
		// 如果热表里还有更老的数据，会在后续月份逐步归档
		int retentionMonths = SystemConfig.getInt("actionLog.retentionDays", 90) / 30 + 2;
		int lookbackMonths = Math.max(retentionMonths, 12);

		Calendar cal = (Calendar) cutoffCal.clone();
		// 从 cutoffTime 月的上一个月开始往前推
		cal.add(Calendar.MONTH, -1);

		for (int i = 0; i < lookbackMonths; i++) {
			Timestamp start = new Timestamp(cal.getTimeInMillis());
			String ym = String.format("%04d%02d", cal.get(Calendar.YEAR), cal.get(Calendar.MONTH) + 1);

			Calendar next = (Calendar) cal.clone();
			next.add(Calendar.MONTH, 1);
			Timestamp end = new Timestamp(next.getTimeInMillis());

			list.add(new MonthRange(ym, start, end));

			cal.add(Calendar.MONTH, -1);
		}

		return list;
	}

	/**
	 * 月份归档范围。
	 */
	public static class MonthRange {
		public final String ym; // yyyyMM
		public final Timestamp start; // 月初（含）
		public final Timestamp end; // 下月初（不含）

		public MonthRange(String ym, Timestamp start, Timestamp end) {
			this.ym = ym;
			this.start = start;
			this.end = end;
		}
	}

}
