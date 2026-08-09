package com.fanglin.report.service;

import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.report.vo.MetricDualTrendVO;
import com.fanglin.report.vo.MetricPointVO;

/**
 * 主材销售指标服务。
 */
public interface SalesMetricService {

	/** 销售趋势：value1=单量，value2=总额。 */
	List<MetricDualTrendVO> querySalesTrend(List<Filter> filters, int company);

	/** 品类结构：按 category 销售额占比。 */
	List<MetricPointVO> queryCategoryDist(List<Filter> filters, int company);

	/** 手动触发重算。 */
	void refreshMetric();

}
