package com.fanglin.customer.vo;

import java.io.Serializable;

public class DecorationCircleBackgroundVO implements Serializable{

	private static final long serialVersionUID = -1854424833115689869L;
	
	private Long dcbid;
	
	private String unionId;
	
	private String path;

	public Long getDcbid() {
		return dcbid;
	}

	public void setDcbid(Long dcbid) {
		this.dcbid = dcbid;
	}

	public String getUnionId() {
		return unionId;
	}

	public void setUnionId(String unionId) {
		this.unionId = unionId;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}
	
}
