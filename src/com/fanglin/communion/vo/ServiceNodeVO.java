package com.fanglin.communion.vo;

import java.io.Serializable;

public class ServiceNodeVO implements Serializable{

	private static final long serialVersionUID = -1022765049929397232L;

	private Long snid;
	
	private String name;
	
	private String detail;
	
	private Short type;
	
	private Short status;
	
	private Integer company;

	public Long getSnid() {
		return snid;
	}

	public void setSnid(Long snid) {
		this.snid = snid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDetail() {
		return detail;
	}

	public void setDetail(String detail) {
		this.detail = detail;
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
