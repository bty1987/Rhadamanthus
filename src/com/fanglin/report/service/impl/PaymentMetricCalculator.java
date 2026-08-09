package com.fanglin.report.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.report.dao.PaymentMetricDao;

/**
 * 财务收款指标计算器：封装 {@link PaymentMetricDao#rebuild()} 的调用。
 *
 * <p>被 {@code ReportMetricJob}（定时）和 {@code PaymentMetricAction}（手动刷新）共用。
 */
@Component
public class PaymentMetricCalculator {

	private static final Logger logger = LoggerFactory.getLogger(PaymentMetricCalculator.class);

	@Autowired
	private PaymentMetricDao paymentMetricDao;

	@Transactional(rollbackFor = Exception.class)
	public void rebuild() {
		logger.info("[metric-payment] rebuild started");
		paymentMetricDao.rebuild();
		logger.info("[metric-payment] rebuild finished");
	}

}
