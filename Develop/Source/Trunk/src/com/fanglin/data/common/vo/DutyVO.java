package com.fanglin.data.common.vo;

import java.io.Serializable;

public class DutyVO implements Serializable {

	private static final long serialVersionUID = 2137362794687628843L;

	private Long did;

	private String name;

	private Short status;

	public Long getDid() {
		return did;
	}

	public void setDid(Long did) {
		this.did = did;
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
