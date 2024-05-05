package com.fanglin.communion.vo;

import java.io.Serializable;

public class DepartmentTypeVO implements Serializable {

	private static final long serialVersionUID = -5617161964738001838L;

	private Integer dtid;

	private String name;

	public Integer getDtid() {
		return dtid;
	}

	public void setDtid(Integer dtid) {
		this.dtid = dtid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

}
