package com.fanglin.store.vo;

import java.io.Serializable;

public class McolorVO implements Serializable {

	private static final long serialVersionUID = 2210447925127451057L;

	private Long cid;

	private Long gid;

	private String color;

	private Short status;

	public McolorVO() {
		super();
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

	public String getColor() {
		return color;
	}

	public void setColor(String color) {
		this.color = color;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}
}
