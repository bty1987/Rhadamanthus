package com.fanglin.report.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.vo.Filter;
import com.fanglin.report.dao.FundsMetricDao;
import com.fanglin.report.service.FundsMetricService;
import com.fanglin.report.vo.FundsTrendVO;

@Service("fundsMetricService")
@Transactional(readOnly = true)
public class FundsMetricServiceImpl implements FundsMetricService {

	@Autowired
	private FundsMetricDao fundsMetricDao;

	@Autowired
	private FundsMetricCalculator fundsMetricCalculator;

	@Override
	public List<FundsTrendVO> queryFundsTrend(List<Filter> filters, int company) {
		return fundsMetricDao.queryFundsTrend(filters, company);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void refreshMetric() {
		fundsMetricCalculator.rebuild();
	}

}
