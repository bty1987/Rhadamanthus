package com.fanglin.data.common.vo;

import java.io.Serializable;

public class ConstructionNodeVO implements Serializable {

	private static final long serialVersionUID = -665024502622400929L;

	private Long cnid;

	private String name;

	private Integer precheck;

	private Integer postcheck;
	
	private Integer stacheck;

	private Integer fincheck;

	private Short status;

	private Short checkout;

	private String startalk;
	
	private String endtalk;
	
	private Integer timeLimit;
	
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

	public Integer getPrecheck() {
		return precheck;
	}

	public void setPrecheck(Integer precheck) {
		this.precheck = precheck;
	}

	public Integer getPostcheck() {
		return postcheck;
	}

	public void setPostcheck(Integer postcheck) {
		this.postcheck = postcheck;
	}
	
	public Integer getStacheck() {
		return stacheck;
	}

	public void setStacheck(Integer stacheck) {
		this.stacheck = stacheck;
	}

	public Integer getFincheck() {
		return fincheck;
	}

	public void setFincheck(Integer fincheck) {
		this.fincheck = fincheck;
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

	public String getStartalk() {
		return startalk;
	}

	public void setStartalk(String startalk) {
		this.startalk = startalk;
	}

	public String getEndtalk() {
		return endtalk;
	}

	public void setEndtalk(String endtalk) {
		this.endtalk = endtalk;
	}

	public Integer getTimeLimit() {
		return timeLimit;
	}

	public void setTimeLimit(Integer timeLimit) {
		this.timeLimit = timeLimit;
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
