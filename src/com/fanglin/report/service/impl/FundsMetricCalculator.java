package com.fanglin.report.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.report.dao.FundsMetricDao;

/**
 * 资金闭环指标计算器：封装 {@link FundsMetricDao#rebuild()} 的调用。
 */
@Component
public class FundsMetricCalculator {

	private static final Logger logger = LoggerFactory.getLogger(FundsMetricCalculator.class);

	@Autowired
	private FundsMetricDao fundsMetricDao;

	@Transactional(rollbackFor = Exception.class)
	public void rebuild() {
		logger.info("[metric-funds] rebuild started");
		fundsMetricDao.rebuild();
		logger.info("[metric-funds] rebuild finished");
	}

}
