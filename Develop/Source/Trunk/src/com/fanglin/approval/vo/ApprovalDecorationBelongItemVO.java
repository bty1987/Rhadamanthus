package com.fanglin.approval.vo;

public class ApprovalDecorationBelongItemVO implements java.io.Serializable {

	private static final long serialVersionUID = 1942560918558612661L;

	private Integer adbiId;
	
	private Integer adbId;
	
	private String orderId;
	
	private String belongUserId;
	
	private Float belongRate;
	
	private String defaultFlag;


	public Integer getAdbiId() {
		return adbiId;
	}

	public void setAdbiId(Integer adbiId) {
		this.adbiId = adbiId;
	}

	public Integer getAdbId() {
		return adbId;
	}

	public void setAdbId(Integer adbId) {
		this.adbId = adbId;
	}

	public String getOrderId() {
		return this.orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public String getBelongUserId() {
		return this.belongUserId;
	}

	public void setBelongUserId(String belongUserId) {
		this.belongUserId = belongUserId;
	}

	public Float getBelongRate() {
		return this.belongRate;
	}

	public void setBelongRate(Float belongRate) {
		this.belongRate = belongRate;
	}

	public String getDefaultFlag() {
		return this.defaultFlag;
	}

	public void setDefaultFlag(String defaultFlag) {
		this.defaultFlag = defaultFlag;
	}

}