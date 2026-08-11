package com.fanglin.report.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.report.dao.ApprovalMetricDao;

/**
 * 审批运营指标计算器：封装 {@link ApprovalMetricDao#rebuild()} 的调用。
 */
@Component
public class ApprovalMetricCalculator {

	private static final Logger logger = LoggerFactory.getLogger(ApprovalMetricCalculator.class);

	@Autowired
	private ApprovalMetricDao approvalMetricDao;

	@Transactional(rollbackFor = Exception.class)
	public void rebuild() {
		logger.info("[metric-approval] rebuild started");
		approvalMetricDao.rebuild();
		logger.info("[metric-approval] rebuild finished");
	}

}
