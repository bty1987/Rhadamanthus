package com.fanglin.data.common.vo;

import java.io.Serializable;

public class ConstructionPaceVO implements Serializable {

	private static final long serialVersionUID = 8797781658485741019L;

	private Long cpid;

	private String name;

	private Short typeness;

	private Integer upperArea;

	private Integer lowerArea;

	private Integer period;

	private Integer company;

	public ConstructionPaceVO() {
		super();
	}

	public Long getCpid() {
		return cpid;
	}

	public void setCpid(Long cpid) {
		this.cpid = cpid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Short getTypeness() {
		return typeness;
	}

	public void setTypeness(Short typeness) {
		this.typeness = typeness;
	}

	public Integer getUpperArea() {
		return upperArea;
	}

	public void setUpperArea(Integer upperArea) {
		this.upperArea = upperArea;
	}

	public Integer getLowerArea() {
		return lowerArea;
	}

	public void setLowerArea(Integer lowerArea) {
		this.lowerArea = lowerArea;
	}

	public Integer getPeriod() {
		return period;
	}

	public void setPeriod(Integer period) {
		this.period = period;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

}
