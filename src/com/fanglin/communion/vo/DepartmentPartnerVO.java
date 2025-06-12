package com.fanglin.communion.vo;

import java.io.Serializable;

import com.fanglin.personel.vo.UserBaseVO;

public class DepartmentPartnerVO implements Serializable {

	private static final long serialVersionUID = -2636011229228523048L;

	private Long dpid;

	private int did;

	private UserBaseVO partner;

	private Short type;

	private Short status;

	private Integer company;

	public DepartmentPartnerVO() {
		super();
	}

	public DepartmentPartnerVO(UserBaseVO partner) {
		super();
		this.partner = partner;
	}

	public Long getDpid() {
		return dpid;
	}

	public void setDpid(Long dpid) {
		this.dpid = dpid;
	}

	public int getDid() {
		return did;
	}

	public void setDid(int did) {
		this.did = did;
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
