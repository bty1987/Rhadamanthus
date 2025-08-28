package com.fanglin.right.vo;

import java.io.Serializable;

public class SalesDeliveryStatusRightVO implements Serializable {

	private static final long serialVersionUID = 4326818286121410564L;

	private Long sdsrid;

	private String name;

	private Long bid;

	private Integer crate;

	private Short status;

	private Short checked;

	private Integer company;

	public SalesDeliveryStatusRightVO() {
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

	public Integer getCrate() {
		return crate;
	}

	public void setCrate(Integer crate) {
		this.crate = crate;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Short getChecked() {
		return checked;
	}

	public void setChecked(Short checked) {
		this.checked = checked;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}
}
