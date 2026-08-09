package com.fanglin.report.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.vo.Filter;
import com.fanglin.report.dao.DecorationMetricDao;
import com.fanglin.report.service.DecorationMetricService;
import com.fanglin.report.vo.MetricPointVO;
import com.fanglin.report.vo.MetricTrendVO;

@Service("decorationMetricService")
@Transactional(readOnly = true)
public class DecorationMetricServiceImpl implements DecorationMetricService {

	@Autowired
	private DecorationMetricDao decorationMetricDao;

	@Autowired
	private DecorationMetricCalculator decorationMetricCalculator;

	@Override
	public List<MetricPointVO> queryFunnel(List<Filter> filters, int company) {
		return decorationMetricDao.queryFunnel(filters, company);
	}

	@Override
	public List<MetricPointVO> queryStatusDist(List<Filter> filters, int company) {
		return decorationMetricDao.queryStatusDist(filters, company);
	}

	@Override
	public List<MetricTrendVO> querySignTrend(List<Filter> filters, int company) {
		return decorationMetricDao.querySignTrend(filters, company);
	}

	@Override
	public List<MetricPointVO> queryTypeDist(List<Filter> filters, int company) {
		return decorationMetricDao.queryTypeDist(filters, company);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void refreshMetric() {
		decorationMetricCalculator.rebuild();
	}

}
