package com.fanglin.communion.vo;

import java.io.Serializable;

public class ContractVO implements Serializable {

	private static final long serialVersionUID = -2099743893004142670L;
	
	private Long cid;
	
	private String no;
	
	private String name;
	
	private String title;
	
	private Short status;
	
	private Integer company;
	
	public ContractVO(){
		super();
	}

	public Long getCid() {
		return cid;
	}

	public void setCid(Long cid) {
		this.cid = cid;
	}

	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
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
