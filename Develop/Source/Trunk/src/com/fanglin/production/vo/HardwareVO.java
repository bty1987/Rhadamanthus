package com.fanglin.production.vo;

import java.io.Serializable;

public class HardwareVO implements Serializable{

	private static final long serialVersionUID = 4572933491237821982L;

	private Long hid;
	
	private Long pid;
	
	private Short status;
	
	private String path;
	
	private String comment;
	
	public HardwareVO() {
		super();
	}

	public Long getHid() {
		return hid;
	}

	public void setHid(Long hid) {
		this.hid = hid;
	}

	public Long getPid() {
		return pid;
	}

	public void setPid(Long pid) {
		this.pid = pid;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}
	
}
