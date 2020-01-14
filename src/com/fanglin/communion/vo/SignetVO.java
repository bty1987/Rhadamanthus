package com.fanglin.communion.vo;

import java.io.Serializable;

public class SignetVO implements Serializable {

	private static final long serialVersionUID = 7539031381907707882L;
	
	private long sid;
	
	private String no;
	
	private String name;
	
	private String keyword;
	
	private short status;
	
	private int company;
	
	public SignetVO(){
		super();
	}

	public long getSid() {
		return sid;
	}

	public void setSid(long sid) {
		this.sid = sid;
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

	public String getKeyword() {
		return keyword;
	}

	public void setKeyword(String keyword) {
		this.keyword = keyword;
	}

	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}
}
