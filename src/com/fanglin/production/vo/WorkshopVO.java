package com.fanglin.production.vo;

import java.io.Serializable;

public class WorkshopVO implements Serializable {

	private static final long serialVersionUID = -5465857054216837099L;

	private Long wsid;

	private String name;

	private Short status;

	private Integer company;

	public Long getWsid() {
		return wsid;
	}

	public void setWsid(Long wsid) {
		this.wsid = wsid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
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
