package com.fanglin.store.vo;

import java.io.Serializable;

public class MformatVO implements Serializable {

	private static final long serialVersionUID = -1740168926033257984L;

	private Long fid;

	private Long gid;

	private String format;

	private Short status;

	public MformatVO() {
		super();
	}

	public Long getFid() {
		return fid;
	}

	public void setFid(Long fid) {
		this.fid = fid;
	}

	public Long getGid() {
		return gid;
	}

	public void setGid(Long gid) {
		this.gid = gid;
	}

	public String getFormat() {
		return format;
	}

	public void setFormat(String format) {
		this.format = format;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

}
