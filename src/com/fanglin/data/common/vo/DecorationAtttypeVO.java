package com.fanglin.data.common.vo;

import java.io.Serializable;

public class DecorationAtttypeVO implements Serializable {

	private static final long serialVersionUID = 7000556642403447516L;

	private Long daid;

	private String name;

	private Short key;

	private Short type;

	private Short status;

	public DecorationAtttypeVO() {
		super();
	}

	public Long getDaid() {
		return daid;
	}

	public void setDaid(Long daid) {
		this.daid = daid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Short getKey() {
		return key;
	}

	public void setKey(Short key) {
		this.key = key;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

}
