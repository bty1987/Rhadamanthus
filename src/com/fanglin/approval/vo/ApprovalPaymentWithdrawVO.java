package com.fanglin.approval.vo;

public class ApprovalPaymentWithdrawVO implements java.io.Serializable {

	private static final long serialVersionUID = -3891246795410984567L;

	private Long apwId;

	private Long aid;

	private String orderId;

	private Short paymentType;

	private Long amount;

	private String comment;

	private Integer status;

	public Long getApwId() {
		return this.apwId;
	}

	public void setApwId(Long apwId) {
		this.apwId = apwId;
	}

	public Long getAid() {
		return this.aid;
	}

	public void setAid(Long aid) {
		this.aid = aid;
	}

	public String getOrderId() {
		return this.orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public Short getPaymentType() {
		return this.paymentType;
	}

	public void setPaymentType(Short paymentType) {
		this.paymentType = paymentType;
	}

	public Long getAmount() {
		return this.amount;
	}

	public void setAmount(Long amount) {
		this.amount = amount;
	}

	public String getComment() {
		return this.comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public Integer getStatus() {
		return this.status;
	}

	public void setStatus(Integer status) {
		this.status = status;
	}

}
