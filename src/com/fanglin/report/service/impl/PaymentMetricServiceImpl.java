package com.fanglin.report.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.vo.Filter;
import com.fanglin.report.dao.PaymentMetricDao;
import com.fanglin.report.service.PaymentMetricService;
import com.fanglin.report.vo.MetricPointVO;
import com.fanglin.report.vo.MetricTrendVO;

@Service("paymentMetricService")
@Transactional(readOnly = true)
public class PaymentMetricServiceImpl implements PaymentMetricService {

	@Autowired
	private PaymentMetricDao paymentMetricDao;

	@Autowired
	private PaymentMetricCalculator paymentMetricCalculator;

	@Override
	public List<MetricTrendVO> queryCollectTrend(List<Filter> filters, int company) {
		return paymentMetricDao.queryCollectTrend(filters, company);
	}

	@Override
	public List<MetricTrendVO> queryRefundTrend(List<Filter> filters, int company) {
		return paymentMetricDao.queryRefundTrend(filters, company);
	}

	@Override
	public List<MetricTrendVO> queryNetTrend(List<Filter> filters, int company) {
		return paymentMetricDao.queryNetTrend(filters, company);
	}

	@Override
	public List<MetricPointVO> queryPaymentTypeDist(List<Filter> filters, int company) {
		return paymentMetricDao.queryPaymentTypeDist(filters, company);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void refreshMetric() {
		paymentMetricCalculator.rebuild();
	}

}
