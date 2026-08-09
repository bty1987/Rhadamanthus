package com.fanglin.report.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.vo.Filter;
import com.fanglin.report.dao.SalesMetricDao;
import com.fanglin.report.service.SalesMetricService;
import com.fanglin.report.vo.MetricDualTrendVO;
import com.fanglin.report.vo.MetricPointVO;

@Service("salesMetricService")
@Transactional(readOnly = true)
public class SalesMetricServiceImpl implements SalesMetricService {

	@Autowired
	private SalesMetricDao salesMetricDao;

	@Autowired
	private SalesMetricCalculator salesMetricCalculator;

	@Override
	public List<MetricDualTrendVO> querySalesTrend(List<Filter> filters, int company) {
		return salesMetricDao.querySalesTrend(filters, company);
	}

	@Override
	public List<MetricPointVO> queryCategoryDist(List<Filter> filters, int company) {
		return salesMetricDao.queryCategoryDist(filters, company);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void refreshMetric() {
		salesMetricCalculator.rebuild();
	}

}
