package com.fanglin.personel.vo;

import java.io.Serializable;

public class UserPartnerVO implements Serializable {

	private static final long serialVersionUID = 550652069147834255L;

	private Long upid;

	private int uid;

	private UserBaseVO partner;

	private Short type;

	private Short status;

	private Integer company;

	public UserPartnerVO() {
		super();
	}

	public UserPartnerVO(UserBaseVO partner) {
		super();
		this.partner = partner;
	}

	public Long getUpid() {
		return upid;
	}

	public void setUpid(Long upid) {
		this.upid = upid;
	}

	public int getUid() {
		return uid;
	}

	public void setUid(int uid) {
		this.uid = uid;
	}

	public UserBaseVO getPartner() {
		return partner;
	}

	public void setPartner(UserBaseVO partner) {
		this.partner = partner;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}
}
