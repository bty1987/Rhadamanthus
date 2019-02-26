package com.fanglin.dingding.po;

import java.util.List;

import com.alibaba.fastjson.JSONObject;

public class User {
	
	private String userid;
	
	private String name;
	
	private boolean active;
	
	private String avatar;
	
	private List<Long> department;
	
	private String position;
	
	private String mobile;
	
	private String email;
	
	private String openId;
	
	private int status;
	
	private JSONObject extattr;
	
	private String jobnumber;
	
	public User() {
	}
	
	public User(String userid, String name) {
		this.userid = userid;
		this.name = name;
	}
	
	@Override
	public String toString() {
		return "User[userid:" + userid + ", name:" + name + ", active:" + active + ", "
				+ "avatar:" + avatar + ", department:" + department +
				", position:" + position + ", mobile:" + mobile + ", email:" + email + 
				", openId:" + openId + ", status:" + status +", extattr:" + extattr;
	}
	
	public String getUserid() {
		return userid;
	}

	public void setUserid(String userid) {
		this.userid = userid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public boolean isActive() {
		return active;
	}

	public void setActive(boolean active) {
		this.active = active;
	}

	public String getAvatar() {
		return avatar;
	}

	public void setAvatar(String avatar) {
		this.avatar = avatar;
	}

	public List<Long> getDepartment() {
		return department;
	}

	public void setDepartment(List<Long> department) {
		this.department = department;
	}

	public String getPosition() {
		return position;
	}

	public void setPosition(String position) {
		this.position = position;
	}

	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getOpenId() {
		return openId;
	}

	public void setOpenId(String openId) {
		this.openId = openId;
	}

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	public JSONObject getExtattr() {
		return extattr;
	}

	public void setExtattr(JSONObject extattr) {
		this.extattr = extattr;
	}

	public String getJobnumber() {
		return jobnumber;
	}

	public void setJobnumber(String jobnumber) {
		this.jobnumber = jobnumber;
	}
	
}
