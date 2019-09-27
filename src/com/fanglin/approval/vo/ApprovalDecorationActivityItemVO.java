package com.fanglin.approval.vo;

public class ApprovalDecorationActivityItemVO implements java.io.Serializable {

	private static final long serialVersionUID = 5989264977776706097L;

	private Long adaiId;

	private Long adaId;

	private String orderId;

	private String activityName;

	private String activityItemName;

	private Short type;

	private Integer num;

	private Integer money;

	private String content;

	private Short stateType;

	private Long asid;

	public Long getAdaiId() {
		return adaiId;
	}

	public void setAdaiId(Long adaiId) {
		this.adaiId = adaiId;
	}

	public Long getAdaId() {
		return adaId;
	}

	public void setAdaId(Long adaId) {
		this.adaId = adaId;
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

	public Integer getMoney() {
		return money;
	}

	public void setMoney(Integer money) {
		this.money = money;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public Short getStateType() {
		return stateType;
	}

	public void setStateType(Short stateType) {
		this.stateType = stateType;
	}

	public Long getAsid() {
		return asid;
	}

	public void setAsid(Long asid) {
		this.asid = asid;
	}

}