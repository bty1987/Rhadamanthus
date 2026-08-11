package com.fanglin.report.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.report.dao.InventoryMetricDao;

/**
 * 仓储物流指标计算器：封装 {@link InventoryMetricDao#rebuild()} 的调用。
 */
@Component
public class InventoryMetricCalculator {

	private static final Logger logger = LoggerFactory.getLogger(InventoryMetricCalculator.class);

	@Autowired
	private InventoryMetricDao inventoryMetricDao;

	@Transactional(rollbackFor = Exception.class)
	public void rebuild() {
		logger.info("[metric-inventory] rebuild started");
		inventoryMetricDao.rebuild();
		logger.info("[metric-inventory] rebuild finished");
	}

}
