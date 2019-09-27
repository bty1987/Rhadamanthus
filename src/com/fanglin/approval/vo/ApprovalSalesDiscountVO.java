package com.fanglin.approval.vo;

public class ApprovalSalesDiscountVO implements java.io.Serializable {

	private static final long serialVersionUID = 711873433253802459L;

	private Integer asdid;

	private Long aid;

	private Long sid;

	private Long referMoney;

	private Short paymentType;

	public ApprovalSalesDiscountVO() {
		super();
	}

	public Integer getAsdid() {
		return asdid;
	}

	public void setAsdid(Integer asdid) {
		this.asdid = asdid;
	}

	public Long getAid() {
		return aid;
	}

	public void setAid(Long aid) {
		this.aid = aid;
	}

	public Long getSid() {
		return sid;
	}

	public void setSid(Long sid) {
		this.sid = sid;
	}

	public Long getReferMoney() {
		return referMoney;
	}

	public void setReferMoney(Long referMoney) {
		this.referMoney = referMoney;
	}

	public Short getPaymentType() {
		return paymentType;
	}

	public void setPaymentType(Short paymentType) {
		this.paymentType = paymentType;
	}

}