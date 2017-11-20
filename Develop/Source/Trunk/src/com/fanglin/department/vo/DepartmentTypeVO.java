package com.fanglin.department.vo;

import java.io.Serializable;

public class DepartmentTypeVO implements Serializable{
	
	private static final long serialVersionUID = -5617161964738001838L;

	private int dtid;
	
	private String name;

	public int getDtid() {
		return dtid;
	}

	public void setDtid(int dtid) {
		this.dtid = dtid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	

	
}
