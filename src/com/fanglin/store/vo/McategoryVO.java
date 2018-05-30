package com.fanglin.store.vo;

import java.io.Serializable;

public class McategoryVO implements Serializable{
	
	private static final long serialVersionUID = -4328485362403429005L;
	
	private Long cid;
	
	private String name;
	
	private String icon;
	
	private Short isShow;

	public McategoryVO() {
		super();
	}
	
	public Long getCid() {
		return cid;
	}

	public void setCid(Long cid) {
		this.cid = cid;
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

	public Short getIsShow() {
		return isShow;
	}

	public void setIsShow(Short isShow) {
		this.isShow = isShow;
	}
	
}
