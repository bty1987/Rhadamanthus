package com.fanglin.data.quotation.vo;

import java.io.Serializable;

public class FunctionAreaTypeVO implements Serializable {

	private static final long serialVersionUID = 4839206175582491623L;

	private Long fatId;

	private String name;

	private Integer company;

	private Short status;

	public FunctionAreaTypeVO() {
		super();
	}

	public Long getFatId() {
		return fatId;
	}

	public void setFatId(Long fatId) {
		this.fatId = fatId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

}
