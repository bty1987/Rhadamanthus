package com.fanglin.customer.vo;

import java.io.Serializable;

public class DecorationCirclePictureVO implements Serializable{

	private static final long serialVersionUID = 714358820557223232L;
	
	private Long dcpid;
	
	private Long dcid;
	
	private String path;

	public Long getDcpid() {
		return dcpid;
	}

	public void setDcpid(Long dcpid) {
		this.dcpid = dcpid;
	}

	public Long getDcid() {
		return dcid;
	}

	public void setDcid(Long dcid) {
		this.dcid = dcid;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}
	
}
