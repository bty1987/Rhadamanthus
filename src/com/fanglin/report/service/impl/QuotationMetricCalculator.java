package com.fanglin.report.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.report.dao.QuotationMetricDao;

/**
 * 报价偏差指标计算器：封装 {@link QuotationMetricDao#rebuild()} 的调用。
 */
@Component
public class QuotationMetricCalculator {

	private static final Logger logger = LoggerFactory.getLogger(QuotationMetricCalculator.class);

	@Autowired
	private QuotationMetricDao quotationMetricDao;

	@Transactional(rollbackFor = Exception.class)
	public void rebuild() {
		logger.info("[metric-quotation] rebuild started");
		quotationMetricDao.rebuild();
		logger.info("[metric-quotation] rebuild finished");
	}

}
