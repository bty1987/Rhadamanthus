package com.fanglin.production.vo;

import java.io.Serializable;

public class ProductionSalesVO implements Serializable{

	private static final long serialVersionUID = -7039071743025723966L;
	
	private Long psid;
	
	private Long pid;
	
	private Long sid;
	
	private Short type;

	public Long getPsid() {
		return psid;
	}

	public void setPsid(Long psid) {
		this.psid = psid;
	}

	public Long getPid() {
		return pid;
	}

	public void setPid(Long pid) {
		this.pid = pid;
	}

	public Long getSid() {
		return sid;
	}

	public void setSid(Long sid) {
		this.sid = sid;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}
	
	

	
}
