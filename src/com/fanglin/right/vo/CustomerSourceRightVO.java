package com.fanglin.right.vo;

import java.io.Serializable;

public class CustomerSourceRightVO implements Serializable {

	private static final long serialVersionUID = -5647348223813794049L;
	
	private Long csdrid;
	
	private Integer uid;
	
	private Integer did;
	
	private Integer company;
	
	public CustomerSourceRightVO(){
		super();
	}
	
	public Long getCsdrid() {
		return csdrid;
	}
	public void setCsdrid(Long csdrid) {
		this.csdrid = csdrid;
	}
	public Integer getUid() {
		return uid;
	}
	public void setUid(Integer uid) {
		this.uid = uid;
	}
	public Integer getDid() {
		return did;
	}
	public void setDid(Integer did) {
		this.did = did;
	}
	public Integer getCompany() {
		return company;
	}
	public void setCompany(Integer company) {
		this.company = company;
	}
	

}
