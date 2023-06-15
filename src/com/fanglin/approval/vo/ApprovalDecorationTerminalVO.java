package com.fanglin.approval.vo;

public class ApprovalDecorationTerminalVO implements java.io.Serializable {

	private static final long serialVersionUID = 4330332373900874336L;

	private Long adtid;

	private Long aid;

	private String orderId;

	public ApprovalDecorationTerminalVO() {
		super();
	}

	public Long getAdtid() {
		return adtid;
	}

	public void setAdtid(Long adtid) {
		this.adtid = adtid;
	}

	public Long getAid() {
		return aid;
	}

	public void setAid(Long aid) {
		this.aid = aid;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

}