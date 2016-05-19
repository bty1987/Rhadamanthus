package com.fanglin.approval.vo;

public class ApprovalActivityItemVO implements java.io.Serializable {

	private static final long serialVersionUID = 5989264977776706097L;

	private Long aaiId;
	
	private Long aaId;
	
	private String orderId;
	
	private String activityName;
	
	private String activityItemName;
	
	private Short type;
	
	private Integer num;
	
	private Float money;
	
	private String content;

	public Long getAaiId() {
		return aaiId;
	}

	public void setAaiId(Long aaiId) {
		this.aaiId = aaiId;
	}

	public Long getAaId() {
		return aaId;
	}

	public void setAaId(Long aaId) {
		this.aaId = aaId;
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

	public String getActivityItemName() {
		return activityItemName;
	}

	public void setActivityItemName(String activityItemName) {
		this.activityItemName = activityItemName;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Integer getNum() {
		return num;
	}

	public void setNum(Integer num) {
		this.num = num;
	}

	public Float getMoney() {
		return money;
	}

	public void setMoney(Float money) {
		this.money = money;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

}