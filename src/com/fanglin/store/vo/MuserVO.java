package com.fanglin.store.vo;

import java.io.Serializable;

public class MuserVO implements Serializable{
	
	private static final long serialVersionUID = -4319484191492418004L;
	
	private Long uid;
	
	private String unionVal;
	
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
	
	public String getUnionVal() {
		return unionVal;
	}

	public void setUnionVal(String unionVal) {
		this.unionVal = unionVal;
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
