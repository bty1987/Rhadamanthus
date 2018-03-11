package com.fanglin.inventory.vo;

public class StorehouseVO implements java.io.Serializable {

	private static final long serialVersionUID = -3979432865722880416L;

	private Long shId;
	
	private String code;
	
	private String name;
	
	private Short status;

	public Long getShId() {
		return this.shId;
	}

	public void setShId(Long shId) {
		this.shId = shId;
	}

	public String getCode() {
		return this.code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Short getStatus() {
		return this.status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

}