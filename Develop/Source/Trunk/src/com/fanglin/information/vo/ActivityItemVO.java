package com.fanglin.information.vo;

public class ActivityItemVO implements java.io.Serializable {

	private static final long serialVersionUID = 2606014203338812720L;

	private Long aiId;
	
	private Long aid;
	
	private String activityName;
	
	private String activityItemName;
	
	private Integer num;
	
	private Short type;
	
	private Float money;

	public Long getAiId() {
		return aiId;
	}

	public void setAiId(Long aiId) {
		this.aiId = aiId;
	}

	public Long getAid() {
		return aid;
	}

	public void setAid(Long aid) {
		this.aid = aid;
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

	public Integer getNum() {
		return num;
	}

	public void setNum(Integer num) {
		this.num = num;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Float getMoney() {
		return money;
	}

	public void setMoney(Float money) {
		this.money = money;
	}

}