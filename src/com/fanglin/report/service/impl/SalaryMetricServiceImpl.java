package com.fanglin.report.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.vo.Filter;
import com.fanglin.report.dao.SalaryMetricDao;
import com.fanglin.report.service.SalaryMetricService;
import com.fanglin.report.vo.MetricDualTrendVO;
import com.fanglin.report.vo.MetricPointVO;

@Service("salaryMetricService")
@Transactional(readOnly = true)
public class SalaryMetricServiceImpl implements SalaryMetricService {

	@Autowired
	private SalaryMetricDao salaryMetricDao;

	@Autowired
	private SalaryMetricCalculator salaryMetricCalculator;

	@Override
	public List<MetricDualTrendVO> querySalaryTrend(List<Filter> filters, int company) {
		return salaryMetricDao.querySalaryTrend(filters, company);
	}

	@Override
	public List<MetricPointVO> queryWorkerTypeDist(List<Filter> filters, int company) {
		return salaryMetricDao.queryWorkerTypeDist(filters, company);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void refreshMetric() {
		salaryMetricCalculator.rebuild();
	}

}
