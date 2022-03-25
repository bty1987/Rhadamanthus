package com.fanglin.customer.vo;

import java.io.Serializable;

public class CircleDrawingVO implements Serializable {

	private static final long serialVersionUID = 714358820557223232L;

	private Long cdid;

	private Long cid;

	private String path;

	public Long getCdid() {
		return cdid;
	}

	public void setCdid(Long cdid) {
		this.cdid = cdid;
	}

	public Long getCid() {
		return cid;
	}

	public void setCid(Long cid) {
		this.cid = cid;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

}
