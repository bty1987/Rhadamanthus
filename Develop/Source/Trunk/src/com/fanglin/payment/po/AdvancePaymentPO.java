package com.fanglin.payment.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.fanglin.data.po.CustomerPO;

@Entity
@Table(name = "advancepayment", catalog = "platform")
public class AdvancePaymentPO implements java.io.Serializable {

	private static final long serialVersionUID = -3956125205251478439L;
	
	public static final String COLUMN_CUSTOMERID_STR = "customer.id";
	
	private int apId;
	
	private CustomerPO customer;
	
	private float balance;
	
	private float materialBalance;
	
	private float zhenglinBalance;
	
	private float projectBalance;
	
	public AdvancePaymentPO() {
		super();
	}
	
	public AdvancePaymentPO(CustomerPO customer) {
		super();
		this.customer = customer;
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

	@Column(name = "balance")
	public float getBalance() {
		return this.balance;
	}

	public void setBalance(float balance) {
		this.balance = balance;
	}

	@Column(name = "materialBalance")
	public float getMaterialBalance() {
		return this.materialBalance;
	}

	public void setMaterialBalance(float materialBalance) {
		this.materialBalance = materialBalance;
	}

	@Column(name = "zhenglinBalance")
	public float getZhenglinBalance() {
		return this.zhenglinBalance;
	}

	public void setZhenglinBalance(float zhenglinBalance) {
		this.zhenglinBalance = zhenglinBalance;
	}

	@Column(name = "projectBalance")
	public float getProjectBalance() {
		return this.projectBalance;
	}

	public void setProjectBalance(float projectBalance) {
		this.projectBalance = projectBalance;
	}

	@OneToOne
	@JoinColumn(nullable = true, name = "customerId", referencedColumnName="id")
	public CustomerPO getCustomer() {
		return customer;
	}

	public void setCustomer(CustomerPO customer) {
		this.customer = customer;
	}

}