package com.fanglin.data.material.vo;

import java.io.Serializable;

public class NoodsVO implements Serializable {

	private static final long serialVersionUID = 6756406849285399408L;

	private Long nid;

	private Long pnid;

	private String name;

	private Integer selling;

	private Integer balance;

	private Integer surplus;

	private Short status;

	private Short calc;

	private Integer company;

	public NoodsVO() {
		super();
	}

	public Long getNid() {
		return nid;
	}

	public void setNid(Long nid) {
		this.nid = nid;
	}

	public Long getPnid() {
		return pnid;
	}

	public void setPnid(Long pnid) {
		this.pnid = pnid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Integer getSelling() {
		return selling;
	}

	public void setSelling(Integer selling) {
		this.selling = selling;
	}

	public Integer getBalance() {
		return balance;
	}

	public void setBalance(Integer balance) {
		this.balance = balance;
	}

	public Integer getSurplus() {
		return surplus;
	}

	public void setSurplus(Integer surplus) {
		this.surplus = surplus;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Short getCalc() {
		return calc;
	}

	public void setCalc(Short calc) {
		this.calc = calc;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

}
