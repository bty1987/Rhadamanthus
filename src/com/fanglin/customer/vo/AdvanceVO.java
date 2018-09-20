package com.fanglin.customer.vo;

import java.io.Serializable;

public class AdvanceVO implements Serializable {

	private static final long serialVersionUID = -2112643806945178036L;

	private Long customerId;

	private Float balance;

	private Float materialBalance;

	private Float projectBalance;

	private Float zhenglinBalance;

	public Long getCustomerId() {
		return customerId;
	}

	public void setCustomerId(Long customerId) {
		this.customerId = customerId;
	}

	public Float getBalance() {
		return balance;
	}

	public void setBalance(Float balance) {
		this.balance = balance;
	}

	public Float getMaterialBalance() {
		return materialBalance;
	}

	public void setMaterialBalance(Float materialBalance) {
		this.materialBalance = materialBalance;
	}

	public Float getProjectBalance() {
		return projectBalance;
	}

	public void setProjectBalance(Float projectBalance) {
		this.projectBalance = projectBalance;
	}

	public Float getZhenglinBalance() {
		return zhenglinBalance;
	}

	public void setZhenglinBalance(Float zhenglinBalance) {
		this.zhenglinBalance = zhenglinBalance;
	}

}
