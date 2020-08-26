package com.fanglin.system.vo;

import java.io.Serializable;

public class RoleVO implements Serializable {

	private static final long serialVersionUID = 9045008682677539729L;
	
	private Integer rid;

	private String no;
	
	private String name;

	protected String content;
	
	private Integer company; 
	
	private String pinyin;
	
	public RoleVO(Integer rid) {
		super();
		this.rid = rid;
	}

	public RoleVO(String no) {
		super();
		this.no = no;
	}

	public RoleVO(){
		super();
	}

	public Integer getRid() {
		return rid;
	}

	public void setRid(Integer rid) {
		this.rid = rid;
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

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

	public String getPinyin() {
		return pinyin;
	}

	public void setPinyin(String pinyin) {
		this.pinyin = pinyin;
	}

	
}
