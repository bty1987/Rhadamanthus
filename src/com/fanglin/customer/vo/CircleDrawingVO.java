package com.fanglin.customer.vo;

import java.io.Serializable;

public class CircleDrawingVO implements Serializable {

	private static final long serialVersionUID = 714358820557223232L;

	private long cdid;

	private long cid;

	private String path;

	public long getCdid() {
		return cdid;
	}

	public void setCdid(long cdid) {
		this.cdid = cdid;
	}

	public long getCid() {
		return cid;
	}

	public void setCid(long cid) {
		this.cid = cid;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

}
