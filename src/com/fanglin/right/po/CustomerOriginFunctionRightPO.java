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

import com.fanglin.customer.po.CustomerOriginFunctionPO;

@Entity
@Table(name = "customeroriginfunctionright", catalog = "platform")
public class CustomerOriginFunctionRightPO implements Serializable {

	private static final long serialVersionUID = 1649622284592882932L;

	private long cfrid;

	private String name;

	private CustomerOriginFunctionPO customerOriginFunction;

	private int company;

	public CustomerOriginFunctionRightPO() {
		super();
	}

	public CustomerOriginFunctionRightPO(CustomerOriginFunctionPO customerOriginFunction) {
		super();
		this.customerOriginFunction = customerOriginFunction;
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
	public CustomerOriginFunctionPO getCustomerOriginFunction() {
		return customerOriginFunction;
	}

	public void setCustomerOriginFunction(
			CustomerOriginFunctionPO customerOriginFunction) {
		this.customerOriginFunction = customerOriginFunction;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

}
