package com.fanglin.right.vo;

import java.io.Serializable;

public class SelectionItemStatusRightVO implements Serializable {

	private static final long serialVersionUID = 4326818286121410564L;

	private Long sdsrid;

	private String name;

	private Long bid;

	private Short status;

	private Integer company;

	public SelectionItemStatusRightVO() {
		super();
	}

	public Long getSdsrid() {
		return sdsrid;
	}

	public void setSdsrid(Long sdsrid) {
		this.sdsrid = sdsrid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Long getBid() {
		return bid;
	}

	public void setBid(Long bid) {
		this.bid = bid;
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

	public void setCompany(int company) {
		this.company = company;
	}
}
