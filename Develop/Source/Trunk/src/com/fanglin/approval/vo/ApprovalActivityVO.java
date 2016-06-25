package com.fanglin.approval.vo;

public class ApprovalActivityVO implements java.io.Serializable {

	private static final long serialVersionUID = -1131604144672368255L;

	private Long aaId;
	
	private Integer aid;
	
	private Long activityId;
	
	private String orderId;
	
	private String activityName;

	public Long getAaId() {
		return aaId;
	}

	public void setAaId(Long aaId) {
		this.aaId = aaId;
	}

	public Integer getAid() {
		return aid;
	}

	public void setAid(Integer aid) {
		this.aid = aid;
	}

	public Long getActivityId() {
		return activityId;
	}

	public void setActivityId(Long activityId) {
		this.activityId = activityId;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public String getActivityName() {
		return activityName;
	}

	public void setActivityName(String activityName) {
		this.activityName = activityName;
	}

}