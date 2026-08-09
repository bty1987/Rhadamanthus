package com.fanglin.report.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.report.dao.ConstructionMetricDao;

/**
 * 施工履约指标计算器：封装 {@link ConstructionMetricDao#rebuild()} 的调用。
 */
@Component
public class ConstructionMetricCalculator {

	private static final Logger logger = LoggerFactory.getLogger(ConstructionMetricCalculator.class);

	@Autowired
	private ConstructionMetricDao constructionMetricDao;

	@Transactional(rollbackFor = Exception.class)
	public void rebuild() {
		logger.info("[metric-construction] rebuild started");
		constructionMetricDao.rebuild();
		logger.info("[metric-construction] rebuild finished");
	}

}
