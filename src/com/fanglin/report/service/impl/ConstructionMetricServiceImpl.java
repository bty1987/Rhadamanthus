package com.fanglin.report.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.vo.Filter;
import com.fanglin.report.dao.ConstructionMetricDao;
import com.fanglin.report.service.ConstructionMetricService;
import com.fanglin.report.vo.MetricDualTrendVO;
import com.fanglin.report.vo.MetricPointVO;

@Service("constructionMetricService")
@Transactional(readOnly = true)
public class ConstructionMetricServiceImpl implements ConstructionMetricService {

	@Autowired
	private ConstructionMetricDao constructionMetricDao;

	@Autowired
	private ConstructionMetricCalculator constructionMetricCalculator;

	@Override
	public List<MetricDualTrendVO> queryStartFinishTrend(List<Filter> filters, int company) {
		return constructionMetricDao.queryStartFinishTrend(filters, company);
	}

	@Override
	public List<MetricDualTrendVO> queryPeriodTrend(List<Filter> filters, int company) {
		return constructionMetricDao.queryPeriodTrend(filters, company);
	}

	@Override
	public List<MetricPointVO> queryOverdueDist(List<Filter> filters, int company) {
		return constructionMetricDao.queryOverdueDist(filters, company);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void refreshMetric() {
		constructionMetricCalculator.rebuild();
	}

}
