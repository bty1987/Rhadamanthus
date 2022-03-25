package com.fanglin.customer.vo;

import java.io.Serializable;

public class BackgroundVO implements Serializable {

	private static final long serialVersionUID = -1854424833115689869L;

	private Long bid;

	private String unionId;

	private String path;

	public Long getBid() {
		return bid;
	}

	public void setBid(Long bid) {
		this.bid = bid;
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
