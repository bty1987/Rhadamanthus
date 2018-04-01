package com.fanglin.production.vo;

import java.io.Serializable;

public class WorkplanVO implements Serializable {

	private static final long serialVersionUID = 78906200111284042L;

	private Long wpid;

	private String name;

	private Short status;

	private String comment;

	private WorkshopVO workshop;

	private Integer company;

	public WorkplanVO() {
		super();
	}

	public WorkplanVO(WorkshopVO workshop) {
		super();
		this.workshop = workshop;
	}

	public Long getWpid() {
		return wpid;
	}

	public void setWpid(Long wpid) {
		this.wpid = wpid;
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

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public WorkshopVO getWorkshop() {
		return workshop;
	}

	public void setWorkshop(WorkshopVO workshop) {
		this.workshop = workshop;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

}
