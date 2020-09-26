package com.fanglin.customer.vo;

import java.io.Serializable;

public class CppointVO implements Serializable {

	private static final long serialVersionUID = 3516842388789272716L;

	private Long cpid;

	private Long cid;

	private Long dpoint;

	private Long spoint;

	private Integer company;

	public CppointVO() {
		super();
	}

	public Long getCpid() {
		return cpid;
	}

	public void setCpid(Long cpid) {
		this.cpid = cpid;
	}

	public Long getCid() {
		return cid;
	}

	public void setCid(Long cid) {
		this.cid = cid;
	}

	public Long getDpoint() {
		return dpoint;
	}

	public void setDpoint(Long dpoint) {
		this.dpoint = dpoint;
	}

	public Long getSpoint() {
		return spoint;
	}

	public void setSpoint(Long spoint) {
		this.spoint = spoint;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

}
