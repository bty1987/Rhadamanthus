package com.fanglin.data.quotation.vo;

import java.io.Serializable;

public class QuotationLabelVO implements Serializable {

	private static final long serialVersionUID = 8547240286291522441L;

	private Long qlid;

	private String name;

	public Long getQlid() {
		return qlid;
	}

	public void setQlid(Long qlid) {
		this.qlid = qlid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

}
