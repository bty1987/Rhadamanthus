package com.fanglin.approval.vo;

public class ApprovalDecorationTerminalItemVO implements java.io.Serializable {

	private static final long serialVersionUID = -2413536366269814033L;

	private Long adtiid;

	private Long aid;

	private Long adtid;

	private Long referMoney;

	private String paymentType;

	public ApprovalDecorationTerminalItemVO() {
		super();
	}

	public Long getAdtiid() {
		return adtiid;
	}

	public void setAdtiid(Long adtiid) {
		this.adtiid = adtiid;
	}

	public Long getAid() {
		return aid;
	}

	public void setAid(Long aid) {
		this.aid = aid;
	}

	public Long getAdtid() {
		return adtid;
	}

	public void setAdtid(Long adtid) {
		this.adtid = adtid;
	}

	public Long getReferMoney() {
		return referMoney;
	}

	public void setReferMoney(Long referMoney) {
		this.referMoney = referMoney;
	}

	public String getPaymentType() {
		return paymentType;
	}

	public void setPaymentType(String paymentType) {
		this.paymentType = paymentType;
	}

}