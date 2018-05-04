package com.fanglin.approval.vo;

public class ApprovalDecorationBelongVO implements java.io.Serializable {
	
	private static final long serialVersionUID = 1563024899730580677L;

	private Integer adbId;
	
	private Long aid;
	
	private String orderId;
	
	private Short belongType;

	public Integer getAdbId() {
		return adbId;
	}

	public void setAdbId(Integer adbId) {
		this.adbId = adbId;
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

	public Short getBelongType() {
		return this.belongType;
	}

	public void setBelongType(Short belongType) {
		this.belongType = belongType;
	}

}