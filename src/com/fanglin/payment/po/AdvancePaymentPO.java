package com.fanglin.payment.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.communion.po.CustomerPO;

@Entity
@Table(name = "advancepayment", catalog = "payment")
public class AdvancePaymentPO implements java.io.Serializable {

	private static final long serialVersionUID = -3956125205251478439L;
	
	public static final String COLUMN_CUSTOMERID_STR = "customer.cid";
	
	private int apId;
	
	private CustomerPO customer;
	
	private float balance;
	
	private float materialBalance;
	
	private float zhenglinBalance;
	
	private float projectBalance;
	
	private int company;
	
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

	@ManyToOne
	@JoinColumn(nullable = true, name = "customerId", referencedColumnName="cid")
	public CustomerPO getCustomer() {
		return customer;
	}

	public void setCustomer(CustomerPO customer) {
		this.customer = customer;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

}