package com.fanglin.report.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.report.service.ApprovalMetricService;
import com.fanglin.report.vo.MetricDualTrendVO;
import com.fanglin.report.vo.MetricPointVO;

/**
 * 审批运营指标报表入口。
 *
 * <p>审批趋势（总量/拒绝双线）+ 类型结构饼图 + 手动刷新。
 * 数据来源 report.metric_approval_monthly，由定时任务每日凌晨刷新。
 */
@ParentPackage("base")
@Namespace("/")
@Controller
public class ApprovalMetricAction extends BaseListAction {

	private static final long serialVersionUID = 1L;

	@Autowired
	private ApprovalMetricService approvalMetricService;

	private List<MetricDualTrendVO> approvalTrend;

	private List<MetricPointVO> typeDist;

	@Action(value = "queryApprovalTrend", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryApprovalTrend() throws FLException {

		approvalTrend = approvalMetricService.queryApprovalTrend(getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryApprovalTypeDist", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryApprovalTypeDist() throws FLException {

		typeDist = approvalMetricService.queryTypeDist(getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "refreshApprovalMetric", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String refreshApprovalMetric() throws FLException {

		approvalMetricService.refreshMetric();

		return SUCCESS;
	}

	public List<MetricDualTrendVO> getApprovalTrend() {
		return approvalTrend;
	}

	public void setApprovalTrend(List<MetricDualTrendVO> approvalTrend) {
		this.approvalTrend = approvalTrend;
	}

	public List<MetricPointVO> getTypeDist() {
		return typeDist;
	}

	public void setTypeDist(List<MetricPointVO> typeDist) {
		this.typeDist = typeDist;
	}

}
