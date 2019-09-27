package com.fanglin.customer.vo;

import java.io.Serializable;

public class AdvanceVO implements Serializable {

	private static final long serialVersionUID = -2112643806945178036L;

	private Long customerId;

	private Long balance;

	private Long materialBalance;

	private Long projectBalance;

	private Long zhenglinBalance;

	public Long getCustomerId() {
		return customerId;
	}

	public void setCustomerId(Long customerId) {
		this.customerId = customerId;
	}

	public Long getBalance() {
		return balance;
	}

	public void setBalance(Long balance) {
		this.balance = balance;
	}

	public Long getMaterialBalance() {
		return materialBalance;
	}

	public void setMaterialBalance(Long materialBalance) {
		this.materialBalance = materialBalance;
	}

	public Long getProjectBalance() {
		return projectBalance;
	}

	public void setProjectBalance(Long projectBalance) {
		this.projectBalance = projectBalance;
	}

	public Long getZhenglinBalance() {
		return zhenglinBalance;
	}

	public void setZhenglinBalance(Long zhenglinBalance) {
		this.zhenglinBalance = zhenglinBalance;
	}

}
