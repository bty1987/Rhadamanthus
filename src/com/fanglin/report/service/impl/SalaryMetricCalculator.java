package com.fanglin.report.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.report.dao.SalaryMetricDao;

/**
 * 人力薪酬指标计算器：封装 {@link SalaryMetricDao#rebuild()} 的调用。
 */
@Component
public class SalaryMetricCalculator {

	private static final Logger logger = LoggerFactory.getLogger(SalaryMetricCalculator.class);

	@Autowired
	private SalaryMetricDao salaryMetricDao;

	@Transactional(rollbackFor = Exception.class)
	public void rebuild() {
		logger.info("[metric-salary] rebuild started");
		salaryMetricDao.rebuild();
		logger.info("[metric-salary] rebuild finished");
	}

}
