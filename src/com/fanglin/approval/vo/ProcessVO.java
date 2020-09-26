package com.fanglin.approval.vo;

import java.io.Serializable;

public class ProcessVO implements Serializable {

	private static final long serialVersionUID = 2803624445085661818L;
	
	private Long pid;
	
	private String name;
	
	private String no;
	
	private String code;
	
	private Short status;
	
	private Integer company;

	public ProcessVO() {
		super();
	}

	public Long getPid() {
		return pid;
	}

	public void setPid(Long pid) {
		this.pid = pid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}
	
}
