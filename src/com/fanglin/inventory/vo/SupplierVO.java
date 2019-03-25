package com.fanglin.inventory.vo;

import java.io.Serializable;

public class SupplierVO implements Serializable{

	private static final long serialVersionUID = 4668244737409398066L;

	private Long sid;
	
	private Long gid;
	
	private String name;
	
	private Short status;

	public Long getSid() {
		return sid;
	}

	public void setSid(Long sid) {
		this.sid = sid;
	}

	public Long getGid() {
		return gid;
	}

	public void setGid(Long gid) {
		this.gid = gid;
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
}
