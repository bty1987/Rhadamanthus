package com.fanglin.report.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.vo.Filter;
import com.fanglin.report.dao.InventoryMetricDao;
import com.fanglin.report.service.InventoryMetricService;
import com.fanglin.report.vo.MetricDualTrendVO;
import com.fanglin.report.vo.MetricPointVO;

@Service("inventoryMetricService")
@Transactional(readOnly = true)
public class InventoryMetricServiceImpl implements InventoryMetricService {

	@Autowired
	private InventoryMetricDao inventoryMetricDao;

	@Autowired
	private InventoryMetricCalculator inventoryMetricCalculator;

	@Override
	public List<MetricDualTrendVO> queryInOutTrend(List<Filter> filters, int company) {
		return inventoryMetricDao.queryInOutTrend(filters, company);
	}

	@Override
	public List<MetricPointVO> queryTypeDist(List<Filter> filters, int company) {
		return inventoryMetricDao.queryTypeDist(filters, company);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void refreshMetric() {
		inventoryMetricCalculator.rebuild();
	}

}
