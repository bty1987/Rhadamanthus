package com.fanglin.report.service;

import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.report.vo.MetricDualTrendVO;
import com.fanglin.report.vo.MetricPointVO;

/**
 * 施工履约指标服务。
 */
public interface ConstructionMetricService {

	/** 开工/完工趋势：value1=开工量，value2=完工量。 */
	List<MetricDualTrendVO> queryStartFinishTrend(List<Filter> filters, int company);

	/** 工期对比：value1=实际工期，value2=计划工期。 */
	List<MetricDualTrendVO> queryPeriodTrend(List<Filter> filters, int company);

	/** 履约健康度：按月超期数。 */
	List<MetricPointVO> queryOverdueDist(List<Filter> filters, int company);

	/** 手动触发重算。 */
	void refreshMetric();

}
