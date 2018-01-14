package com.fanglin.production.vo;

import java.io.Serializable;

public class QuoteTypeVO implements Serializable{

	private static final long serialVersionUID = -8102867602759630189L;

	private Long qtid;
	
	private String name;
	
	private Short status;

	public Long getQtid() {
		return qtid;
	}

	public void setQtid(Long qtid) {
		this.qtid = qtid;
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
