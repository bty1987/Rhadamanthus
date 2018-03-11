package com.fanglin.system.vo;

import java.io.Serializable;

public class CompanyVO implements Serializable {

	private static final long serialVersionUID = 1384863319040968146L;

	private String cid;
	
	private Integer no;

	private String name;
	
	private String fullname;
	
	private String address;
	
	private String corporation;
	
	private String phone;

	private Short status;

	public CompanyVO() {
		super();
	}

	public CompanyVO(String cid) {
		super();
		this.cid = cid;
	}

	public String getCid() {
		return cid;
	}

	public void setCid(String cid) {
		this.cid = cid;
	}

	public Integer getNo() {
		return no;
	}

	public void setNo(Integer no) {
		this.no = no;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getFullname() {
		return fullname;
	}

	public void setFullname(String fullname) {
		this.fullname = fullname;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getCorporation() {
		return corporation;
	}

	public void setCorporation(String corporation) {
		this.corporation = corporation;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

}
