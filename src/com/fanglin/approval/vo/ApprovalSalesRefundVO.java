package com.fanglin.approval.vo;

public class ApprovalSalesRefundVO implements java.io.Serializable {

	private static final long serialVersionUID = 4375086454094267620L;

	private Long asrid;

	private Long aid;

	private Long sid;

	private Float refund;
	
	private Float refundTotal;

	private Short type;
	

	public Float getRefundTotal() {
		return refundTotal;
	}

	public void setRefundTotal(Float refundTotal) {
		this.refundTotal = refundTotal;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Long getAsrid() {
		return asrid;
	}

	public void setAsrid(Long asrid) {
		this.asrid = asrid;
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

	public Float getRefund() {
		return refund;
	}

	public void setRefund(Float refund) {
		this.refund = refund;
	}



}
