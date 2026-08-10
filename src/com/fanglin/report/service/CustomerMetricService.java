package com.fanglin.report.service;

import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.report.vo.MetricDualTrendVO;
import com.fanglin.report.vo.MetricPointVO;

/**
 * 客户获客指标服务。
 */
public interface CustomerMetricService {

	/** 获客漏斗趋势：value1=报备量，value2=确认量。 */
	List<MetricDualTrendVO> queryFunnelTrend(List<Filter> filters, int company);

	/** 来源渠道结构：按 source 报备量占比。 */
	List<MetricPointVO> querySourceDist(List<Filter> filters, int company);

	/** 转单趋势：按月转单量。 */
	List<MetricPointVO> queryConvertTrend(List<Filter> filters, int company);

	/** 手动触发重算。 */
	void refreshMetric();

}
