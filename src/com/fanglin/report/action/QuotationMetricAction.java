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
import com.fanglin.report.service.QuotationMetricService;
import com.fanglin.report.vo.MetricDualTrendVO;

/**
 * 报价偏差指标报表入口。
 *
 * <p>报价 vs 签约额趋势（双线）+ 手动刷新。
 * 数据来源 report.metric_quotation_monthly，由定时任务每日凌晨刷新。
 */
@ParentPackage("base")
@Namespace("/")
@Controller
public class QuotationMetricAction extends BaseListAction {

	private static final long serialVersionUID = 1L;

	@Autowired
	private QuotationMetricService quotationMetricService;

	private List<MetricDualTrendVO> quotationSignTrend;

	@Action(value = "queryQuotationSignTrend", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQuotationSignTrend() throws FLException {

		quotationSignTrend = quotationMetricService.queryQuotationSignTrend(getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "refreshQuotationMetric", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String refreshQuotationMetric() throws FLException {

		quotationMetricService.refreshMetric();

		return SUCCESS;
	}

	public List<MetricDualTrendVO> getQuotationSignTrend() {
		return quotationSignTrend;
	}

	public void setQuotationSignTrend(List<MetricDualTrendVO> quotationSignTrend) {
		this.quotationSignTrend = quotationSignTrend;
	}

}
