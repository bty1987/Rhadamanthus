package com.fanglin.decoration.vo;

import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserBaseVO;

public class DecorationActivityItemVO implements java.io.Serializable {

	private static final long serialVersionUID = 1820529592422543989L;

	private Long daiId;

	private Long aid;

	private String orderId;

	private String activityName;

	private String activityItemName;

	private Short type;

	private Short state;

	private Integer num;

	private Float money;

	private String content;

	private UserBaseVO receiveUserId;

	private String receiveUserName;

	private Timestamp receiveTime;

	private Long asid;

	private Short stateType;

	private Short isStock; // 库存标识

	private Short isPrefor; // 业绩标识

	public DecorationActivityItemVO() {
		super();
	}

	public Long getDaiId() {
		return daiId;
	}

	public void setDaiId(Long daiId) {
		this.daiId = daiId;
	}

	public Long getAid() {
		return aid;
	}

	public void setAid(Long aid) {
		this.aid = aid;
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

	public Short getState() {
		return state;
	}

	public void setState(Short state) {
		this.state = state;
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

	public UserBaseVO getReceiveUserId() {
		return receiveUserId;
	}

	public void setReceiveUserId(UserBaseVO receiveUserId) {
		this.receiveUserId = receiveUserId;
	}

	public String getReceiveUserName() {
		return receiveUserName;
	}

	public void setReceiveUserName(String receiveUserName) {
		this.receiveUserName = receiveUserName;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getReceiveTime() {
		return receiveTime;
	}

	public void setReceiveTime(Timestamp receiveTime) {
		this.receiveTime = receiveTime;
	}

	public Long getAsid() {
		return asid;
	}

	public void setAsid(Long asid) {
		this.asid = asid;
	}

	public Short getStateType() {
		return stateType;
	}

	public void setStateType(Short stateType) {
		this.stateType = stateType;
	}

	public Short getIsStock() {
		return isStock;
	}

	public void setIsStock(Short isStock) {
		this.isStock = isStock;
	}

	public Short getIsPrefor() {
		return isPrefor;
	}

	public void setIsPrefor(Short isPrefor) {
		this.isPrefor = isPrefor;
	}

}