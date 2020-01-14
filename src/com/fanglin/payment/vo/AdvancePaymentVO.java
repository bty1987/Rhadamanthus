package com.fanglin.payment.vo;

import com.fanglin.decoration.vo.DecorationVO;

public class AdvancePaymentVO implements java.io.Serializable {

	private static final long serialVersionUID = -3956125205251478439L;

	private Integer apId;
	
	private DecorationVO decoration;
	
	private Long balance;
	
	private Long projectBalance;
	
	private Long materialBalance;
	
	private Long zhenglinBalance;

	public AdvancePaymentVO() {
		super();
	}

	public AdvancePaymentVO(DecorationVO decoration) {
		super();
		this.decoration = decoration;
	}

	public Integer getApId() {
		return apId;
	}

	public void setApId(Integer apId) {
		this.apId = apId;
	}

	public DecorationVO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationVO decoration) {
		this.decoration = decoration;
	}

	public Long getBalance() {
		return balance;
	}

	public void setBalance(Long balance) {
		this.balance = balance;
	}

	public Long getProjectBalance() {
		return projectBalance;
	}

	public void setProjectBalance(Long projectBalance) {
		this.projectBalance = projectBalance;
	}

	public Long getMaterialBalance() {
		return materialBalance;
	}

	public void setMaterialBalance(Long materialBalance) {
		this.materialBalance = materialBalance;
	}

	public Long getZhenglinBalance() {
		return zhenglinBalance;
	}

	public void setZhenglinBalance(Long zhenglinBalance) {
		this.zhenglinBalance = zhenglinBalance;
	}
	
}