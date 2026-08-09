package com.fanglin.report.analytics.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.vo.Filter;
import com.fanglin.report.analytics.dao.DecorationMetricDao;
import com.fanglin.report.analytics.domain.DecorationDomainCalculator;
import com.fanglin.report.analytics.service.DecorationAnalyticsService;
import com.fanglin.report.analytics.vo.MetricPointVO;
import com.fanglin.report.analytics.vo.MetricTrendVO;

@Service("decorationAnalyticsService")
@Transactional(readOnly = true)
public class DecorationAnalyticsServiceImpl implements DecorationAnalyticsService {

	@Autowired
	private DecorationMetricDao decorationMetricDao;

	@Autowired
	private DecorationDomainCalculator decorationDomainCalculator;

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
		decorationDomainCalculator.rebuild();
	}

}
