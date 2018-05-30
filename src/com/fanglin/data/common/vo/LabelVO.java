package com.fanglin.data.common.vo;

import java.io.Serializable;

public class LabelVO implements Serializable {

	private static final long serialVersionUID = -6244941175772594861L;

	private int lid;
	
	private String name;
	
	private String proportion;
	
	private Short type;
	
	private Short status;

	public LabelVO(){
		super();
	}

	public int getLid() {
		return lid;
	}

	public void setLid(int lid) {
		this.lid = lid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getProportion() {
		return proportion;
	}

	public void setProportion(String proportion) {
		this.proportion = proportion;
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
