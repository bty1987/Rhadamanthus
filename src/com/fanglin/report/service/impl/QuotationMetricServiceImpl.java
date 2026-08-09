package com.fanglin.report.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.vo.Filter;
import com.fanglin.report.dao.QuotationMetricDao;
import com.fanglin.report.service.QuotationMetricService;
import com.fanglin.report.vo.MetricDualTrendVO;

@Service("quotationMetricService")
@Transactional(readOnly = true)
public class QuotationMetricServiceImpl implements QuotationMetricService {

	@Autowired
	private QuotationMetricDao quotationMetricDao;

	@Autowired
	private QuotationMetricCalculator quotationMetricCalculator;

	@Override
	public List<MetricDualTrendVO> queryQuotationSignTrend(List<Filter> filters, int company) {
		return quotationMetricDao.queryQuotationSignTrend(filters, company);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void refreshMetric() {
		quotationMetricCalculator.rebuild();
	}

}
