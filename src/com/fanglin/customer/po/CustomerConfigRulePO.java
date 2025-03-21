package com.fanglin.customer.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "customerconfigrule", catalog = "customer")
public class CustomerConfigRulePO implements Serializable {

	private static final long serialVersionUID = -2889787070942218547L;

	private long ccrid;

	private String signRate; // 签单率

	private String comaRate; // 主基比

	private String depositPrice; // 设计费

	private String signPrice; // 签单额

	private String signAvgs; // 均单值

	private int source; // 保底资源数(月)

	private int people; // 人员数

	private int protect; // 保底数

	private int polling; // 轮询数

	private int surplus; // 剩余数

	private int company;

	public CustomerConfigRulePO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "ccrid")
	public long getCcrid() {
		return ccrid;
	}

	public void setCcrid(long ccrid) {
		this.ccrid = ccrid;
	}

	@Column(name = "signRate")
	public String getSignRate() {
		return signRate;
	}

	public void setSignRate(String signRate) {
		this.signRate = signRate;
	}

	@Column(name = "comaRate")
	public String getComaRate() {
		return comaRate;
	}

	public void setComaRate(String comaRate) {
		this.comaRate = comaRate;
	}

	@Column(name = "depositPrice")
	public String getDepositPrice() {
		return depositPrice;
	}

	public void setDepositPrice(String depositPrice) {
		this.depositPrice = depositPrice;
	}

	@Column(name = "signPrice")
	public String getSignPrice() {
		return signPrice;
	}

	public void setSignPrice(String signPrice) {
		this.signPrice = signPrice;
	}

	@Column(name = "signAvgs")
	public String getSignAvgs() {
		return signAvgs;
	}

	public void setSignAvgs(String signAvgs) {
		this.signAvgs = signAvgs;
	}

	@Column(name = "source")
	public int getSource() {
		return source;
	}

	public void setSource(int source) {
		this.source = source;
	}

	@Column(name = "people")
	public int getPeople() {
		return people;
	}

	public void setPeople(int people) {
		this.people = people;
	}

	@Column(name = "protect")
	public int getProtect() {
		return protect;
	}

	public void setProtect(int protect) {
		this.protect = protect;
	}

	@Column(name = "polling")
	public int getPolling() {
		return polling;
	}

	public void setPolling(int polling) {
		this.polling = polling;
	}

	@Column(name = "surplus")
	public int getSurplus() {
		return surplus;
	}

	public CustomerConfigRulePO setSurplus(int surplus) {
		this.surplus = surplus;
		return this;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

}
