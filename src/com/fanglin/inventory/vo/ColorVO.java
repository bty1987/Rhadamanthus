package com.fanglin.inventory.vo;

import java.io.Serializable;

public class ColorVO implements Serializable {

	private static final long serialVersionUID = 50729235722901174L;

	private Long cid;

	private Long gid;

	private String name;

	private Short status;

	public ColorVO() {
		super();
	}

	public ColorVO(Long cid) {
		super();
		this.cid = cid;
	}

	public Long getCid() {
		return cid;
	}

	public void setCid(Long cid) {
		this.cid = cid;
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
