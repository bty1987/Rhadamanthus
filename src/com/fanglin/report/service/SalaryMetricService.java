package com.fanglin.report.service;

import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.report.vo.MetricDualTrendVO;
import com.fanglin.report.vo.MetricPointVO;

/**
 * 人力薪酬指标服务。
 */
public interface SalaryMetricService {

	/** 工费趋势：value1=单量，value2=实发总额。 */
	List<MetricDualTrendVO> querySalaryTrend(List<Filter> filters, int company);

	/** 工种结构：按 twotype 实发额占比。 */
	List<MetricPointVO> queryWorkerTypeDist(List<Filter> filters, int company);

	/** 手动触发重算。 */
	void refreshMetric();

}
