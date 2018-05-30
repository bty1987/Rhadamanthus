package com.fanglin.store.vo;

import java.io.Serializable;

public class MbrandVO implements Serializable{

	private static final long serialVersionUID = -4319485362492429007L;
	
	private Long bid;
	
	private McategoryVO mcategory;
	
	private String name;
	
	private String icon;
	
	private Short status;

	public MbrandVO() {
		super();
	}
	
	public MbrandVO(McategoryVO mcategory) {
		super();
		this.mcategory = mcategory;
	}
	
	public Long getBid() {
		return bid;
	}

	public void setBid(Long bid) {
		this.bid = bid;
	}
	
	public McategoryVO getMcategory() {
		return mcategory;
	}

	public void setMcategory(McategoryVO mcategory) {
		this.mcategory = mcategory;
	}
	
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
	
	public String getIcon() {
		return icon;
	}

	public void setIcon(String icon) {
		this.icon = icon;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}
	
}
