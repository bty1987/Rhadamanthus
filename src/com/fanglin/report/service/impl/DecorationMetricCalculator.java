package com.fanglin.report.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.report.dao.DecorationMetricDao;

/**
 * 装修指标计算器：封装 {@link DecorationMetricDao#rebuild()} 的调用。
 *
 * <p>被 {@code ReportMetricJob}（定时）和 {@code DecorationMetricAction}（手动刷新）共用，
 * 保证两边走同一套聚合逻辑。
 */
@Component
public class DecorationMetricCalculator {

	private static final Logger logger = LoggerFactory.getLogger(DecorationMetricCalculator.class);

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
