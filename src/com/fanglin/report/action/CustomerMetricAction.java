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
import com.fanglin.report.service.CustomerMetricService;
import com.fanglin.report.vo.MetricDualTrendVO;
import com.fanglin.report.vo.MetricPointVO;

/**
 * 客户获客指标报表入口。
 *
 * <p>获客漏斗趋势（报备/确认双线）+ 来源渠道结构 + 转单趋势 + 手动刷新。
 * 数据来源 report.metric_customer_monthly，由定时任务每日凌晨刷新。
 */
@ParentPackage("base")
@Namespace("/")
@Controller
public class CustomerMetricAction extends BaseListAction {

	private static final long serialVersionUID = 1L;

	@Autowired
	private CustomerMetricService customerMetricService;

	private List<MetricDualTrendVO> funnelTrend;

	private List<MetricPointVO> sourceDist;

	private List<MetricPointVO> convertTrend;

	@Action(value = "queryCustomerFunnelTrend", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCustomerFunnelTrend() throws FLException {

		funnelTrend = customerMetricService.queryFunnelTrend(getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryCustomerSourceDist", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCustomerSourceDist() throws FLException {

		sourceDist = customerMetricService.querySourceDist(getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryCustomerConvertTrend", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCustomerConvertTrend() throws FLException {

		convertTrend = customerMetricService.queryConvertTrend(getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "refreshCustomerMetric", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String refreshCustomerMetric() throws FLException {

		customerMetricService.refreshMetric();

		return SUCCESS;
	}

	public List<MetricDualTrendVO> getFunnelTrend() {
		return funnelTrend;
	}

	public void setFunnelTrend(List<MetricDualTrendVO> funnelTrend) {
		this.funnelTrend = funnelTrend;
	}

	public List<MetricPointVO> getSourceDist() {
		return sourceDist;
	}

	public void setSourceDist(List<MetricPointVO> sourceDist) {
		this.sourceDist = sourceDist;
	}

	public List<MetricPointVO> getConvertTrend() {
		return convertTrend;
	}

	public void setConvertTrend(List<MetricPointVO> convertTrend) {
		this.convertTrend = convertTrend;
	}

}
