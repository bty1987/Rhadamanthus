package com.fanglin.inventory.vo;

public class ApprovalSalesRefundVO implements java.io.Serializable {

	private static final long serialVersionUID = 4375086454094267620L;

	private Long asrid;

	private Integer aid;

	private Long sid;

	private Float refund;

	private short type;

	public Long getAsrid() {
		return asrid;
	}

	public void setAsrid(Long asrid) {
		this.asrid = asrid;
	}

	public Integer getAid() {
		return aid;
	}

	public void setAid(Integer aid) {
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

	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

}
