package com.fanglin.communion.vo;

import java.io.Serializable;

import com.fanglin.personel.vo.UserBaseVO;

public class CityProperPartnerVO implements Serializable {

	private static final long serialVersionUID = -1201451845127309244L;

	private Long cppid;

	private int cpid;

	private UserBaseVO partner;

	private Short type;

	private Short status;

	private Integer company;

	public CityProperPartnerVO() {
		super();
	}

	public CityProperPartnerVO(UserBaseVO partner) {
		super();
		this.partner = partner;
	}

	public Long getCppid() {
		return cppid;
	}

	public void setCppid(Long cppid) {
		this.cppid = cppid;
	}

	public int getCpid() {
		return cpid;
	}

	public void setCpid(int cpid) {
		this.cpid = cpid;
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
