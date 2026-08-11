package com.fanglin.report.service;

import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.report.vo.MetricDualTrendVO;
import com.fanglin.report.vo.MetricPointVO;

/**
 * 审批运营指标服务。
 */
public interface ApprovalMetricService {

	/** 审批趋势：value1=审批总量，value2=拒绝量。 */
	List<MetricDualTrendVO> queryApprovalTrend(List<Filter> filters, int company);

	/** 审批类型结构：按 type 审批量占比。 */
	List<MetricPointVO> queryTypeDist(List<Filter> filters, int company);

	/** 手动触发重算。 */
	void refreshMetric();

}
