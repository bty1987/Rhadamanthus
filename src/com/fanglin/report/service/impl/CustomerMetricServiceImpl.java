package com.fanglin.report.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.vo.Filter;
import com.fanglin.report.dao.CustomerMetricDao;
import com.fanglin.report.service.CustomerMetricService;
import com.fanglin.report.vo.MetricDualTrendVO;
import com.fanglin.report.vo.MetricPointVO;

@Service("customerMetricService")
@Transactional(readOnly = true)
public class CustomerMetricServiceImpl implements CustomerMetricService {

	@Autowired
	private CustomerMetricDao customerMetricDao;

	@Autowired
	private CustomerMetricCalculator customerMetricCalculator;

	@Override
	public List<MetricDualTrendVO> queryFunnelTrend(List<Filter> filters, int company) {
		return customerMetricDao.queryFunnelTrend(filters, company);
	}

	@Override
	public List<MetricPointVO> querySourceDist(List<Filter> filters, int company) {
		return customerMetricDao.querySourceDist(filters, company);
	}

	@Override
	public List<MetricPointVO> queryConvertTrend(List<Filter> filters, int company) {
		return customerMetricDao.queryConvertTrend(filters, company);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void refreshMetric() {
		customerMetricCalculator.rebuild();
	}

}
