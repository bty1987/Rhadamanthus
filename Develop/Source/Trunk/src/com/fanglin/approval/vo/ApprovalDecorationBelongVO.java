package com.fanglin.approval.vo;

public class ApprovalDecorationBelongVO implements java.io.Serializable {
	
	private static final long serialVersionUID = 1563024899730580677L;

	private Integer adbId;
	
	private Integer aid;
	
	private String orderId;
	
	private String belongType;

	public Integer getAdbId() {
		return adbId;
	}

	public void setAdbId(Integer adbId) {
		this.adbId = adbId;
	}

	public Integer getAid() {
		return this.aid;
	}

	public void setAid(Integer aid) {
		this.aid = aid;
	}

	public String getOrderId() {
		return this.orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public String getBelongType() {
		return this.belongType;
	}

	public void setBelongType(String belongType) {
		this.belongType = belongType;
	}

}