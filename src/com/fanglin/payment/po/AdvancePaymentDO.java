package com.fanglin.payment.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "advancepayment", catalog = "payment")
public class AdvancePaymentDO implements java.io.Serializable {
	
	private static final long serialVersionUID = -4086747589678244893L;

	private int apId;
	
	private String orderId;
	
	private long balance;
	
	private long projectBalance;
	
	private long materialBalance;
	
	private long zhenglinBalance;
	
	public AdvancePaymentDO() {
		super();
	}

	public AdvancePaymentDO(String orderId) {
		super();
		this.orderId = orderId;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "apId")
	public int getApId() {
		return this.apId;
	}

	public void setApId(int apId) {
		this.apId = apId;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "balance")
	public long getBalance() {
		return this.balance;
	}

	public void setBalance(long balance) {
		this.balance = balance;
	}
	
	@Column(name = "projectBalance")
	public long getProjectBalance() {
		return this.projectBalance;
	}

	public void setProjectBalance(long projectBalance) {
		this.projectBalance = projectBalance;
	}

	@Column(name = "materialBalance")
	public long getMaterialBalance() {
		return this.materialBalance;
	}

	public void setMaterialBalance(long materialBalance) {
		this.materialBalance = materialBalance;
	}

	@Column(name = "zhenglinBalance")
	public long getZhenglinBalance() {
		return this.zhenglinBalance;
	}

	public void setZhenglinBalance(long zhenglinBalance) {
		this.zhenglinBalance = zhenglinBalance;
	}

}