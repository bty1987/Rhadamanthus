package com.fanglin.report.analytics.domain;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.report.analytics.dao.DecorationMetricDao;

/**
 * 装修主题域计算器：封装 {@link DecorationMetricDao#rebuild()} 的调用。
 *
 * <p>被 {@code MetricRefreshJob}（定时）和 {@code DecorationAnalyticsAction}（手动刷新）共用，
 * 保证两边走同一套聚合逻辑。
 */
@Component
public class DecorationDomainCalculator {

	private static final Logger logger = LoggerFactory.getLogger(DecorationDomainCalculator.class);

	@Autowired
	private DecorationMetricDao decorationMetricDao;

	/**
	 * 全量重算装修日级汇总。
	 *
	 * <p>事务范围仅限本方法。内部跑跨库只读聚合 + 幂等写入，由 SQL 层 ON DUPLICATE KEY UPDATE 保证重跑安全。
	 */
	@Transactional(rollbackFor = Exception.class)
	public void rebuild() {
		logger.info("[metric-decoration] rebuild started");
		decorationMetricDao.rebuild();
		logger.info("[metric-decoration] rebuild finished");
	}

}
