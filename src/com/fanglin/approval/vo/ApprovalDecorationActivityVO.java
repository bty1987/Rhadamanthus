package com.fanglin.approval.vo;

public class ApprovalDecorationActivityVO implements java.io.Serializable {

	private static final long serialVersionUID = -1131604144672368255L;

	private Long adaId;
	
	private Long aid;
	
	private Long activityId;
	
	private String orderId;
	
	private String activityName;

	Long getAdaId() {
		return adaId;
	}

	void setAdaId(Long adaId) {
		this.adaId = adaId;
	}

	public Long getAid() {
		return aid;
	}

	public void setAid(Long aid) {
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