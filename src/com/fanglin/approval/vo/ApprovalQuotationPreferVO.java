package com.fanglin.approval.vo;

import java.io.Serializable;

public class ApprovalQuotationPreferVO implements Serializable {

	private static final long serialVersionUID = -7919649025106541299L;

	private Long aqpid;

	private Long aid;

	private Long qid;

	private Long qpid;

	private Long ppid;

	private Long preferPrice;

	private Long managePrefer;

	private Long advancePrefer;

	private Long activityPrice;

	private Long activityProfit;

	private Long totalPrice;

	private Long taxPrice;

	public ApprovalQuotationPreferVO() {
		super();
	}

	public ApprovalQuotationPreferVO(Long aqpid, Long aid, Long qid, Long qpid, Long ppid, Long preferPrice, Long managePrefer, Long advancePrefer) {
		super();
		this.aqpid = aqpid;
		this.aid = aid;
		this.qid = qid;
		this.qpid = qpid;
		this.ppid = ppid;
		this.preferPrice = preferPrice;
		this.managePrefer = managePrefer;
		this.advancePrefer = advancePrefer;
	}

	public Long getAqpid() {
		return aqpid;
	}

	public void setAqpid(Long aqpid) {
		this.aqpid = aqpid;
	}

	public Long getAid() {
		return aid;
	}

	public void setAid(Long aid) {
		this.aid = aid;
	}

	public Long getQid() {
		return qid;
	}

	public void setQid(Long qid) {
		this.qid = qid;
	}

	public Long getQpid() {
		return qpid;
	}

	public void setQpid(Long qpid) {
		this.qpid = qpid;
	}

	public Long getPpid() {
		return ppid;
	}

	public void setPpid(Long ppid) {
		this.ppid = ppid;
	}

	public Long getPreferPrice() {
		return preferPrice;
	}

	public void setPreferPrice(Long preferPrice) {
		this.preferPrice = preferPrice;
	}

	public Long getManagePrefer() {
		return managePrefer;
	}

	public void setManagePrefer(Long managePrefer) {
		this.managePrefer = managePrefer;
	}

	public Long getAdvancePrefer() {
		return advancePrefer;
	}

	public void setAdvancePrefer(Long advancePrefer) {
		this.advancePrefer = advancePrefer;
	}

	public Long getActivityPrice() {
		return activityPrice;
	}

	public void setActivityPrice(Long activityPrice) {
		this.activityPrice = activityPrice;
	}

	public Long getActivityProfit() {
		return activityProfit;
	}

	public void setActivityProfit(Long activityProfit) {
		this.activityProfit = activityProfit;
	}

	public Long getTotalPrice() {
		return totalPrice;
	}

	public void setTotalPrice(Long totalPrice) {
		this.totalPrice = totalPrice;
	}

	public Long getTaxPrice() {
		return taxPrice;
	}

	public void setTaxPrice(Long taxPrice) {
		this.taxPrice = taxPrice;
	}

}
