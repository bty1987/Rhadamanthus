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
import com.fanglin.report.service.DecorationMetricService;
import com.fanglin.report.vo.MetricPointVO;
import com.fanglin.report.vo.MetricTrendVO;

/**
 * 装修销售转化指标报表入口。
 *
 * <p>4 个查询（漏斗/状态分布/签单额趋势/装修类型分布）+ 1 个手动刷新（重算汇总表）。
 * 数据来源 report.metric_decoration_daily，由定时任务每日凌晨刷新。
 */
@ParentPackage("base")
@Namespace("/")
@Controller
public class DecorationMetricAction extends BaseListAction {

	private static final long serialVersionUID = 1L;

	@Autowired
	private DecorationMetricService decorationMetricService;

	private List<MetricPointVO> funnel;

	private List<MetricPointVO> statusDist;

	private List<MetricTrendVO> signTrend;

	private List<MetricPointVO> typeDist;

	@Action(value = "queryDecorationFunnel", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationFunnel() throws FLException {

		funnel = decorationMetricService.queryFunnel(getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryDecorationStatusDist", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationStatusDist() throws FLException {

		statusDist = decorationMetricService.queryStatusDist(getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryDecorationSignTrend", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationSignTrend() throws FLException {

		signTrend = decorationMetricService.querySignTrend(getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryDecorationTypeDist", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationTypeDist() throws FLException {

		typeDist = decorationMetricService.queryTypeDist(getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "refreshDecorationMetric", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String refreshDecorationMetric() throws FLException {

		decorationMetricService.refreshMetric();

		return SUCCESS;
	}

	public List<MetricPointVO> getFunnel() {
		return funnel;
	}

	public void setFunnel(List<MetricPointVO> funnel) {
		this.funnel = funnel;
	}

	public List<MetricPointVO> getStatusDist() {
		return statusDist;
	}

	public void setStatusDist(List<MetricPointVO> statusDist) {
		this.statusDist = statusDist;
	}

	public List<MetricTrendVO> getSignTrend() {
		return signTrend;
	}

	public void setSignTrend(List<MetricTrendVO> signTrend) {
		this.signTrend = signTrend;
	}

	public List<MetricPointVO> getTypeDist() {
		return typeDist;
	}

	public void setTypeDist(List<MetricPointVO> typeDist) {
		this.typeDist = typeDist;
	}

}
