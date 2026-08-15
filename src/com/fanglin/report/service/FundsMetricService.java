package com.fanglin.report.service;

import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.report.vo.FundsTrendVO;

/**
 * 资金闭环指标服务。
 */
public interface FundsMetricService {

	/** 资金三段趋势：按月返回总报价额/总签约额/总收款/总退款。 */
	List<FundsTrendVO> queryFundsTrend(List<Filter> filters, int company);

	/** 手动触发重算。 */
	void refreshMetric();

}
