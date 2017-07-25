package com.fanglin.data.construction.vo;

import java.io.Serializable;

public class ConstructionNodeVO implements Serializable{

	private static final long serialVersionUID = -665024502622400929L;

	private Long cnid;
	
	private String name;
	
	private Short status;
	
	private Short sort;

	public Long getCnid() {
		return cnid;
	}

	public void setCnid(Long cnid) {
		this.cnid = cnid;
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

	public Short getSort() {
		return sort;
	}

	public void setSort(Short sort) {
		this.sort = sort;
	}
	
}
