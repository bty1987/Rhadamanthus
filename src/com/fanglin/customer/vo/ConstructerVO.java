package com.fanglin.customer.vo;

import java.io.Serializable;

public class ConstructerVO implements Serializable {

	private static final long serialVersionUID = -494556024622395178L;

	private String userId;

	private String userName;

	private String currentName;

	private String phone;

	private Short schedule;

	private String userPhoto;

	public ConstructerVO() {
		super();
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getCurrentName() {
		return currentName;
	}

	public void setCurrentName(String currentName) {
		this.currentName = currentName;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public Short getSchedule() {
		return schedule;
	}

	public void setSchedule(Short schedule) {
		this.schedule = schedule;
	}

	public String getUserPhoto() {
		return userPhoto;
	}

	public void setUserPhotop(String userPhoto) {
		this.userPhoto = userPhoto;
	}

}
