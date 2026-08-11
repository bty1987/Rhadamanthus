package com.fanglin.report.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.vo.Filter;
import com.fanglin.report.dao.ApprovalMetricDao;
import com.fanglin.report.service.ApprovalMetricService;
import com.fanglin.report.vo.MetricDualTrendVO;
import com.fanglin.report.vo.MetricPointVO;

@Service("approvalMetricService")
@Transactional(readOnly = true)
public class ApprovalMetricServiceImpl implements ApprovalMetricService {

	@Autowired
	private ApprovalMetricDao approvalMetricDao;

	@Autowired
	private ApprovalMetricCalculator approvalMetricCalculator;

	@Override
	public List<MetricDualTrendVO> queryApprovalTrend(List<Filter> filters, int company) {
		return approvalMetricDao.queryApprovalTrend(filters, company);
	}

	@Override
	public List<MetricPointVO> queryTypeDist(List<Filter> filters, int company) {
		return approvalMetricDao.queryTypeDist(filters, company);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void refreshMetric() {
		approvalMetricCalculator.rebuild();
	}

}
