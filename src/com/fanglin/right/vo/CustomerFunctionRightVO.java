package com.fanglin.right.vo;

import java.io.Serializable;

import com.fanglin.customer.vo.CustomerFunctionVO;

public class CustomerFunctionRightVO implements Serializable {

	private static final long serialVersionUID = 525525964174605944L;

	private Long cfrid;
	
	private String name;
	
	private CustomerFunctionVO customerFunction;
	
	private int company;

	public CustomerFunctionRightVO() {
		super();
	}

	public CustomerFunctionRightVO(CustomerFunctionVO customerFunction) {
		super();
		this.customerFunction = customerFunction;
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

	public CustomerFunctionVO getCustomerFunction() {
		return customerFunction;
	}

	public void setCustomerFunction(
			CustomerFunctionVO customerFunction) {
		this.customerFunction = customerFunction;
	}

	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

}
