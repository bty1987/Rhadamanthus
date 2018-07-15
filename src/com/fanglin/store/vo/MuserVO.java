package com.fanglin.store.vo;

import java.io.Serializable;

public class MuserVO implements Serializable{
	
	private static final long serialVersionUID = -4319484191492418004L;
	
	private Long uid;
	
	private String unionId;
	
	private String name;
	
	private String phone;
	
	private Short gender;
	
	private String birthday;

	public MuserVO() {
		super();
	}
	
	public Long getUid() {
		return uid;
	}

	public void setUid(Long uid) {
		this.uid = uid;
	}

	public String getUnionId() {
		return unionId;
	}

	public void setUnionId(String unionId) {
		this.unionId = unionId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
	
	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}
	
	public Short getGender() {
		return gender;
	}

	public void setGender(Short gender) {
		this.gender = gender;
	}
	
	public String getBirthday() {
		return birthday;
	}

	public void setBirthday(String birthday) {
		this.birthday = birthday;
	}
	
}
