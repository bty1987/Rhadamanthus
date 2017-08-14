package com.fanglin.system.vo;

import java.io.Serializable;

public class CompanyVO implements Serializable {

	private static final long serialVersionUID = 1384863319040968146L;

	private String cid;
	
	private Integer no;

	private String name;

	private Short status;

	public String getCid() {
		return cid;
	}

	public void setCid(String cid) {
		this.cid = cid;
	}

	public Integer getNo() {
		return no;
	}

	public void setNo(Integer no) {
		this.no = no;
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
