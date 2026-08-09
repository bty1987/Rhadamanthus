package com.fanglin.report.service;

import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.report.vo.MetricDualTrendVO;

/**
 * 报价偏差指标服务。
 */
public interface QuotationMetricService {

	/** 报价 vs 签约趋势：value1=平均报价额，value2=平均签约额。 */
	List<MetricDualTrendVO> queryQuotationSignTrend(List<Filter> filters, int company);

	/** 手动触发重算。 */
	void refreshMetric();

}
