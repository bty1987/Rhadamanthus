package com.fanglin.payment.vo;

import com.fanglin.communion.vo.CustomerVO;


public class AdvancePaymentVO implements java.io.Serializable {

	private static final long serialVersionUID = -3956125205251478439L;

	private Integer apId;
	
	private CustomerVO customer;
	
	private Double balance;
	
	private Double projectBalance;
	
	private Double materialBalance;
	
	private Double zhenglinBalance;

	public AdvancePaymentVO() {
		super();
	}

	public AdvancePaymentVO(CustomerVO customer) {
		super();
		this.customer = customer;
	}

	public Integer getApId() {
		return apId;
	}

	public void setApId(Integer apId) {
		this.apId = apId;
	}

	public CustomerVO getCustomer() {
		return customer;
	}

	public void setCustomer(CustomerVO customer) {
		this.customer = customer;
	}

	public Double getBalance() {
		return balance;
	}

	public void setBalance(Double balance) {
		this.balance = balance;
	}

	public Double getProjectBalance() {
		return projectBalance;
	}

	public void setProjectBalance(Double projectBalance) {
		this.projectBalance = projectBalance;
	}

	public Double getMaterialBalance() {
		return materialBalance;
	}

	public void setMaterialBalance(Double materialBalance) {
		this.materialBalance = materialBalance;
	}

	public Double getZhenglinBalance() {
		return zhenglinBalance;
	}

	public void setZhenglinBalance(Double zhenglinBalance) {
		this.zhenglinBalance = zhenglinBalance;
	}
	
}