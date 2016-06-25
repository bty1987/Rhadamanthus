package com.fanglin.payment.vo;

import com.fanglin.personel.po.UserPO;

public class AdvancePaymentVO implements java.io.Serializable {

	private static final long serialVersionUID = -3956125205251478439L;

	private Integer apId;
	
	private UserPO userPO;
	
	private Double balance;
	
	private Double materialBalance;
	
	private Double zhenglinBalance;
	
	private Double projectBalance;

	public Integer getApId() {
		return this.apId;
	}

	public void setApId(Integer apId) {
		this.apId = apId;
	}
	
	public UserPO getUserPO() {
		return userPO;
	}

	public void setUserPO(UserPO userPO) {
		this.userPO = userPO;
	}

	public Double getBalance() {
		return this.balance;
	}

	public void setBalance(Double balance) {
		this.balance = balance;
	}

	public Double getMaterialBalance() {
		return this.materialBalance;
	}

	public void setMaterialBalance(Double materialBalance) {
		this.materialBalance = materialBalance;
	}

	public Double getZhenglinBalance() {
		return this.zhenglinBalance;
	}

	public void setZhenglinBalance(Double zhenglinBalance) {
		this.zhenglinBalance = zhenglinBalance;
	}

	public Double getProjectBalance() {
		return this.projectBalance;
	}

	public void setProjectBalance(Double projectBalance) {
		this.projectBalance = projectBalance;
	}

}