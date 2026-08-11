package com.fanglin.report.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.report.po.ApprovalMonthlyMetricPO;
import com.fanglin.report.vo.MetricDualTrendVO;
import com.fanglin.report.vo.MetricPointVO;

/**
 * 审批运营指标汇总 DAO。
 */
public interface ApprovalMetricDao extends Dao<ApprovalMonthlyMetricPO> {

	/** 全量重算审批月级汇总（INSERT ... ON DUPLICATE KEY UPDATE）。 */
	void rebuild();

	/** 审批趋势：value1=审批总量，value2=拒绝量。 */
	List<MetricDualTrendVO> queryApprovalTrend(List<Filter> filters, int company);

	/** 审批类型结构：按 type 返回审批量占比。 */
	List<MetricPointVO> queryTypeDist(List<Filter> filters, int company);

}
