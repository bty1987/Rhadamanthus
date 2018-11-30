package com.fanglin.market.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

public class CnoticeVO implements Serializable{

	private static final long serialVersionUID = 2010990958028530088L;
	
	private Long cnid;
	
	private Long suid;
	
	private Long ruid;
	
	private String name;
	
	private String phone;
	
	private Short status;
	
	private Timestamp createTime;
	
	private String comment;

	public Long getCnid() {
		return cnid;
	}

	public void setCnid(Long cnid) {
		this.cnid = cnid;
	}

	public Long getSuid() {
		return suid;
	}

	public void setSuid(Long suid) {
		this.suid = suid;
	}

	public Long getRuid() {
		return ruid;
	}

	public void setRuid(Long ruid) {
		this.ruid = ruid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}
