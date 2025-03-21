package com.fanglin.customer.vo;

import java.io.Serializable;

public class CustomerConfigRuleVO implements Serializable {

	private static final long serialVersionUID = -933606166631049130L;

	private Long ccrid;

	private String signRate; // 签单率

	private String comaRate; // 主基比

	private String depositPrice; // 设计费

	private String signPrice; // 签单额

	private String signAvgs; // 均单值

	private Integer source; // 保底资源数(月)

	private Integer people; // 人员数

	private Integer protect; // 保底数

	private Integer polling; // 轮询数

	private Integer surplus; // 剩余数

	private Integer company;

	public CustomerConfigRuleVO() {
		super();
	}

	public Long getCcrid() {
		return ccrid;
	}

	public void setCcrid(Long ccrid) {
		this.ccrid = ccrid;
	}

	public String getSignRate() {
		return signRate;
	}

	public void setSignRate(String signRate) {
		this.signRate = signRate;
	}

	public String getComaRate() {
		return comaRate;
	}

	public void setComaRate(String comaRate) {
		this.comaRate = comaRate;
	}

	public String getDepositPrice() {
		return depositPrice;
	}

	public void setDepositPrice(String depositPrice) {
		this.depositPrice = depositPrice;
	}

	public String getSignPrice() {
		return signPrice;
	}

	public void setSignPrice(String signPrice) {
		this.signPrice = signPrice;
	}

	public String getSignAvgs() {
		return signAvgs;
	}

	public void setSignAvgs(String signAvgs) {
		this.signAvgs = signAvgs;
	}

	public Integer getSource() {
		return source;
	}

	public void setSource(Integer source) {
		this.source = source;
	}

	public Integer getPeople() {
		return people;
	}

	public void setPeople(Integer people) {
		this.people = people;
	}

	public Integer getProtect() {
		return protect;
	}

	public void setProtect(Integer protect) {
		this.protect = protect;
	}

	public Integer getPolling() {
		return polling;
	}

	public void setPolling(Integer polling) {
		this.polling = polling;
	}

	public Integer getSurplus() {
		return surplus;
	}

	public void setSurplus(Integer surplus) {
		this.surplus = surplus;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

}
