package com.fanglin.communion.vo;

import java.io.Serializable;

public class QuotationBigCategoryVO implements Serializable {

	private static final long serialVersionUID = -673076034332817739L;

	private int id;

	private String name;

	private Integer qtid;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Integer getQtid() {
		return qtid;
	}

	public void setQtid(Integer qtid) {
		this.qtid = qtid;
	}
}
