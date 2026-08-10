package com.fanglin.report.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.report.dao.CustomerMetricDao;

/**
 * 客户获客指标计算器：封装 {@link CustomerMetricDao#rebuild()} 的调用。
 */
@Component
public class CustomerMetricCalculator {

	private static final Logger logger = LoggerFactory.getLogger(CustomerMetricCalculator.class);

	@Autowired
	private CustomerMetricDao customerMetricDao;

	@Transactional(rollbackFor = Exception.class)
	public void rebuild() {
		logger.info("[metric-customer] rebuild started");
		customerMetricDao.rebuild();
		logger.info("[metric-customer] rebuild finished");
	}

}
