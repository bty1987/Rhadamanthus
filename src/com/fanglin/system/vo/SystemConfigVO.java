package com.fanglin.system.vo;

import java.io.Serializable;

import org.apache.struts2.json.annotations.JSON;


public class SystemConfigVO implements Serializable{

	private static final long serialVersionUID = 7156788273515784461L;

	private Long scid;
	
	private String key;
	
	private String value;
	
	private Integer cuid;
	
	private String createName;
	
	private String createTime;
	
	private String comment;
	
	private Integer company; 

	public Long getScid() {
		return scid;
	}

	public void setScid(Long scid) {
		this.scid = scid;
	}

	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public Integer getCuid() {
		return cuid;
	}

	public void setCuid(Integer cuid) {
		this.cuid = cuid;
	}

	public String getCreateName() {
		return createName;
	}

	public void setCreateName(String createName) {
		this.createName = createName;
	}

	@JSON(format="yyyy-MM-dd HH:mm:ss")
	public String getCreateTime() {
		return createTime;
	}

	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}
	
}
