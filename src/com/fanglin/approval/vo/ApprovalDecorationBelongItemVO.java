package com.fanglin.approval.vo;

public class ApprovalDecorationBelongItemVO implements java.io.Serializable {

	private static final long serialVersionUID = 1942560918558612661L;

	private Integer adbiId;

	private Integer adbId;

	private String orderId;

	private String userId;

	private Integer rate;

	private Short defaultFlag;

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

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public Integer getRate() {
		return rate;
	}

	public void setRate(Integer rate) {
		this.rate = rate;
	}

	public Short getDefaultFlag() {
		return this.defaultFlag;
	}

	public void setDefaultFlag(Short defaultFlag) {
		this.defaultFlag = defaultFlag;
	}

}