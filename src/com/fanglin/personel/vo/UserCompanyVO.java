package com.fanglin.personel.vo;

import java.io.Serializable;

import com.fanglin.system.vo.CompanyVO;

public class UserCompanyVO implements Serializable {

	private static final long serialVersionUID = 1338233896132683919L;

	private long ucid;

	private int uid;

	private CompanyVO company;

	public UserCompanyVO() {
		super();
	}

	public UserCompanyVO(CompanyVO company) {
		super();
		this.company = company;
	}

	public long getUcid() {
		return ucid;
	}

	public void setUcid(long ucid) {
		this.ucid = ucid;
	}

	public int getUid() {
		return uid;
	}

	public void setUid(int uid) {
		this.uid = uid;
	}

	public CompanyVO getCompany() {
		return company;
	}

	public void setCompany(CompanyVO company) {
		this.company = company;
	}

}
