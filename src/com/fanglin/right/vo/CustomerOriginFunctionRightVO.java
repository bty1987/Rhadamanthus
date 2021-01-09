package com.fanglin.right.vo;

import java.io.Serializable;

import com.fanglin.customer.vo.CustomerOriginFunctionVO;

public class CustomerOriginFunctionRightVO implements Serializable {

	private static final long serialVersionUID = 525525964174605944L;

	private Long cfrid;
	
	private String name;
	
	private CustomerOriginFunctionVO customerOriginFunction;
	
	private int company;

	public CustomerOriginFunctionRightVO() {
		super();
	}

	public CustomerOriginFunctionRightVO(CustomerOriginFunctionVO customerOriginFunction) {
		super();
		this.customerOriginFunction = customerOriginFunction;
	}

	public Long getCfrid() {
		return cfrid;
	}

	public void setCfrid(Long cfrid) {
		this.cfrid = cfrid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public CustomerOriginFunctionVO getCustomerOriginFunction() {
		return customerOriginFunction;
	}

	public void setCustomerOriginFunction(
			CustomerOriginFunctionVO customerOriginFunction) {
		this.customerOriginFunction = customerOriginFunction;
	}

	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

}
