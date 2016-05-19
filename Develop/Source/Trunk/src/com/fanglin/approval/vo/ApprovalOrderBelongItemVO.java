package com.fanglin.approval.vo;

public class ApprovalOrderBelongItemVO implements java.io.Serializable {

	private static final long serialVersionUID = 1942560918558612661L;

	private Integer aobiId;
	
	private Integer aobId;
	
	private String orderId;
	
	private String belongUserId;
	
	private Float belongRate;
	
	private String defaultFlag;

	public Integer getAobiId() {
		return this.aobiId;
	}

	public void setAobiId(Integer aobiId) {
		this.aobiId = aobiId;
	}

	public Integer getAobId() {
		return this.aobId;
	}

	public void setAobId(Integer aobId) {
		this.aobId = aobId;
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