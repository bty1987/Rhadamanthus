package com.fanglin.system.vo;

import java.io.Serializable;

public class CompanyVO implements Serializable {

	private static final long serialVersionUID = 1L;
	
	private Integer cid;
	
	private Integer no;

	private String name;

	private Short status;

	public Integer getCid() {
		return cid;
	}

	public void setCid(Integer cid) {
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
