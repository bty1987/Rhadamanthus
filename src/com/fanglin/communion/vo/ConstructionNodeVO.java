package com.fanglin.communion.vo;

import java.io.Serializable;

public class ConstructionNodeVO implements Serializable{

	private static final long serialVersionUID = -665024502622400929L;

	private Long cnid;
	
	private String name;
	
	private Float precheck;
	
	private Float postcheck;
	
	private Short status;
	
	private Short checkout;
	
	private Short sort;
	
	private Integer company;

	public Long getCnid() {
		return cnid;
	}

	public void setCnid(Long cnid) {
		this.cnid = cnid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Float getPrecheck() {
		return precheck;
	}

	public void setPrecheck(Float precheck) {
		this.precheck = precheck;
	}

	public Float getPostcheck() {
		return postcheck;
	}

	public void setPostcheck(Float postcheck) {
		this.postcheck = postcheck;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Short getCheckout() {
		return checkout;
	}

	public void setCheckout(Short checkout) {
		this.checkout = checkout;
	}

	public Short getSort() {
		return sort;
	}

	public void setSort(Short sort) {
		this.sort = sort;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}
	
}
