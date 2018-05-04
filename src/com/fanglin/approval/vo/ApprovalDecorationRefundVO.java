package com.fanglin.approval.vo;

public class ApprovalDecorationRefundVO implements java.io.Serializable {

	private static final long serialVersionUID = -4557316199511145480L;

	private Integer adrId;
	
	private Long aid;
	
	private Long paymentId;

	public Integer getAdrId() {
		return this.adrId;
	}

	public void setAdrId(Integer adrId) {
		this.adrId = adrId;
	}

	public Long getAid() {
		return this.aid;
	}

	public void setAid(Long aid) {
		this.aid = aid;
	}

	public Long getPaymentId() {
		return this.paymentId;
	}

	public void setPaymentId(Long paymentId) {
		this.paymentId = paymentId;
	}

}