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
import com.fanglin.report.service.PaymentMetricService;
import com.fanglin.report.vo.MetricPointVO;
import com.fanglin.report.vo.MetricTrendVO;

/**
 * 财务收款指标报表入口。
 *
 * <p>收退款趋势（含收款/退款/净收款三线）+ 款项结构饼图 + 手动刷新。
 * 数据来源 report.metric_payment_daily，由定时任务每日凌晨刷新。
 */
@ParentPackage("base")
@Namespace("/")
@Controller
public class PaymentMetricAction extends BaseListAction {

	private static final long serialVersionUID = 1L;

	@Autowired
	private PaymentMetricService paymentMetricService;

	private List<MetricTrendVO> collectTrend;

	private List<MetricTrendVO> refundTrend;

	private List<MetricTrendVO> netTrend;

	private List<MetricPointVO> paymentTypeDist;

	@Action(value = "queryPaymentTrend", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryPaymentTrend() throws FLException {

		collectTrend = paymentMetricService.queryCollectTrend(getFilters(), queryCompany());
		refundTrend = paymentMetricService.queryRefundTrend(getFilters(), queryCompany());
		netTrend = paymentMetricService.queryNetTrend(getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryPaymentTypeDist", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryPaymentTypeDist() throws FLException {

		paymentTypeDist = paymentMetricService.queryPaymentTypeDist(getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "refreshPaymentMetric", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String refreshPaymentMetric() throws FLException {

		paymentMetricService.refreshMetric();

		return SUCCESS;
	}

	public List<MetricTrendVO> getCollectTrend() {
		return collectTrend;
	}

	public void setCollectTrend(List<MetricTrendVO> collectTrend) {
		this.collectTrend = collectTrend;
	}

	public List<MetricTrendVO> getRefundTrend() {
		return refundTrend;
	}

	public void setRefundTrend(List<MetricTrendVO> refundTrend) {
		this.refundTrend = refundTrend;
	}

	public List<MetricTrendVO> getNetTrend() {
		return netTrend;
	}

	public void setNetTrend(List<MetricTrendVO> netTrend) {
		this.netTrend = netTrend;
	}

	public List<MetricPointVO> getPaymentTypeDist() {
		return paymentTypeDist;
	}

	public void setPaymentTypeDist(List<MetricPointVO> paymentTypeDist) {
		this.paymentTypeDist = paymentTypeDist;
	}

}
