package com.fanglin.right.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.customer.po.CustomerFunctionPO;

@Entity
@Table(name = "customerfunctionright", catalog = "platform")
public class CustomerFunctionRightPO implements Serializable {

	private static final long serialVersionUID = 1649622284592882932L;

	private long cfrid;

	private String name;

	private CustomerFunctionPO customerFunction;

	private int company;

	public CustomerFunctionRightPO() {
		super();
	}

	public CustomerFunctionRightPO(CustomerFunctionPO customerFunction) {
		super();
		this.customerFunction = customerFunction;
	}

	@Id
	@GeneratedValue
	@Column(name = "cfrid")
	public long getCfrid() {
		return cfrid;
	}

	public void setCfrid(long cfrid) {
		this.cfrid = cfrid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "cfid", referencedColumnName = "cfid")
	public CustomerFunctionPO getCustomerFunction() {
		return customerFunction;
	}

	public void setCustomerFunction(
			CustomerFunctionPO customerFunction) {
		this.customerFunction = customerFunction;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

}
