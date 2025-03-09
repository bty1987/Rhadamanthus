package com.fanglin.communion.vo;

import java.io.Serializable;

public class ServiceNodeVO implements Serializable {

	private static final long serialVersionUID = -1022765049929397232L;

	private Long snid;

	private String name;

	private String detail;

	private Short type;

	private Short status;

	private Integer company;
	
	private Long psnid;
	
	private Short attnode;
	
	private Integer blankNum;
	
	private Integer workNum;
	
	private Short loop;
	
	private Short userType;
	

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

	public Long getPsnid() {
		return psnid;
	}

	public void setPsnid(Long psnid) {
		this.psnid = psnid;
	}

	public Short getAttnode() {
		return attnode;
	}

	public void setAttnode(Short attnode) {
		this.attnode = attnode;
	}

	public Integer getBlankNum() {
		return blankNum;
	}

	public void setBlankNum(Integer blankNum) {
		this.blankNum = blankNum;
	}

	public Integer getWorkNum() {
		return workNum;
	}

	public void setWorkNum(Integer workNum) {
		this.workNum = workNum;
	}

	public Short getLoop() {
		return loop;
	}

	public void setLoop(Short loop) {
		this.loop = loop;
	}

	public Short getUserType() {
		return userType;
	}

	public void setUserType(Short userType) {
		this.userType = userType;
	}

	
}
