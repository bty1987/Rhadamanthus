package com.fanglin.report.vo;

import java.io.Serializable;

/**
 * 订单全景视图对象（一户穿透）。
 *
 * <p>聚合装修单在 5 个业务域的全生命周期数据：decoration 订单 / quotation 报价 /
 * construction 施工 / payment 收款 / sales 主材销售。单订单实时只读查询。
 */
public class OrderPanoramaVO implements Serializable {

	private static final long serialVersionUID = 1L;

	private String orderId; // 订单号

	private int status; // 订单状态（0初始~8完工）

	private long signAmount; // 签约额（分）

	private String createTime; // 下单时间

	private String contractTime; // 签约时间

	// ---- 报价域 ----
	private long quotationAmount; // 报价额（分，默认报价）

	private long diffAmount; // 偏差额（签约-报价，分）

	// ---- 施工域 ----
	private int constructionProcess; // 施工状态（-1无施工记录/0未完工/1已完工）

	private String startTime; // 开工时间

	private String finishTime; // 完工时间

	private int period; // 工期（天）

	// ---- 收款域 ----
	private long collectAmount; // 收款总额（分）

	private long refundAmount; // 退款总额（分）

	private long paidupAmount; // 净收款（分）

	// ---- 主材域 ----
	private long salesCount; // 主材销售单数

	private long salesAmount; // 主材销售总额（分）

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	public long getSignAmount() {
		return signAmount;
	}

	public void setSignAmount(long signAmount) {
		this.signAmount = signAmount;
	}

	public String getCreateTime() {
		return createTime;
	}

	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}

	public String getContractTime() {
		return contractTime;
	}

	public void setContractTime(String contractTime) {
		this.contractTime = contractTime;
	}

	public long getQuotationAmount() {
		return quotationAmount;
	}

	public void setQuotationAmount(long quotationAmount) {
		this.quotationAmount = quotationAmount;
	}

	public long getDiffAmount() {
		return diffAmount;
	}

	public void setDiffAmount(long diffAmount) {
		this.diffAmount = diffAmount;
	}

	public int getConstructionProcess() {
		return constructionProcess;
	}

	public void setConstructionProcess(int constructionProcess) {
		this.constructionProcess = constructionProcess;
	}

	public String getStartTime() {
		return startTime;
	}

	public void setStartTime(String startTime) {
		this.startTime = startTime;
	}

	public String getFinishTime() {
		return finishTime;
	}

	public void setFinishTime(String finishTime) {
		this.finishTime = finishTime;
	}

	public int getPeriod() {
		return period;
	}

	public void setPeriod(int period) {
		this.period = period;
	}

	public long getCollectAmount() {
		return collectAmount;
	}

	public void setCollectAmount(long collectAmount) {
		this.collectAmount = collectAmount;
	}

	public long getRefundAmount() {
		return refundAmount;
	}

	public void setRefundAmount(long refundAmount) {
		this.refundAmount = refundAmount;
	}

	public long getPaidupAmount() {
		return paidupAmount;
	}

	public void setPaidupAmount(long paidupAmount) {
		this.paidupAmount = paidupAmount;
	}

	public long getSalesCount() {
		return salesCount;
	}

	public void setSalesCount(long salesCount) {
		this.salesCount = salesCount;
	}

	public long getSalesAmount() {
		return salesAmount;
	}

	public void setSalesAmount(long salesAmount) {
		this.salesAmount = salesAmount;
	}

}
