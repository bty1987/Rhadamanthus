package com.fanglin.construction.vo;

import java.io.Serializable;

public class ConstructionCostVO implements Serializable {
	
	private static final long serialVersionUID = -645024802722501929L;

	private Long ccid;

	private String name;

	private Integer areaLeft;

	private Integer areaRight;
	
	private Long accessory;
	
	private Long salary;

	private Short status;

	private Short sort;

	private Integer company;

	public Long getCcid() {
		return ccid;
	}

	public void setCcid(Long ccid) {
		this.ccid = ccid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Integer getAreaLeft() {
		return areaLeft;
	}

	public void setAreaLeft(Integer areaLeft) {
		this.areaLeft = areaLeft;
	}

	public Integer getAreaRight() {
		return areaRight;
	}

	public void setAreaRight(Integer areaRight) {
		this.areaRight = areaRight;
	}

	public Long getAccessory() {
		return accessory;
	}

	public void setAccessory(Long accessory) {
		this.accessory = accessory;
	}

	public Long getSalary() {
		return salary;
	}

	public void setSalary(Long salary) {
		this.salary = salary;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Short getSort() {
		return sort;
	}

	public void setSort(Short sort) {
		this.sort = sort;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}
	
}
