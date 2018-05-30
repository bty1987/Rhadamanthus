package com.fanglin.store.vo;

import java.io.Serializable;

public class AddressVO implements Serializable {

	private static final long serialVersionUID = -8642566370766676228L;

	private Long aid;

	private MuserVO muser;
	
	private String name;
	
	private String phone;

	private String address;

	private Short status;

	public AddressVO() {
		super();
	}

	public AddressVO(MuserVO muser) {
		super();
		this.muser = muser;
	}

	public Long getAid() {
		return aid;
	}

	public void setAid(Long aid) {
		this.aid = aid;
	}

	public MuserVO getMuser() {
		return muser;
	}

	public void setMuser(MuserVO muser) {
		this.muser = muser;
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

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

}
