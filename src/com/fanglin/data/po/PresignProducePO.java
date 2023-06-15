package com.fanglin.data.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "presignproduce", catalog = "quotation")
public class PresignProducePO implements Serializable {

	private static final long serialVersionUID = 1534658265397926933L;

	public static final short STATUS_INIT_INT = 0;

	private long ppid;

	private String name;

	private long quotePrice;

	private int quoteArea;

	private long unitPrice;

	private int discount;

	private int manageRate;

	private long costPrice;

	private int profitRate;

	private long offset;

	private short status;

	private int company;

	private long preferPrice;

	private long mostPrice;

	private int costRate;

	private int mostRate;

	public PresignProducePO() {
		super();
	}

	@Id
	@GeneratedValue
	@Column(name = "ppid")
	public long getPpid() {
		return ppid;
	}

	public void setPpid(long ppid) {
		this.ppid = ppid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "quotePrice")
	public long getQuotePrice() {
		return quotePrice;
	}

	public void setQuotePrice(long quotePrice) {
		this.quotePrice = quotePrice;
	}

	@Column(name = "quoteArea")
	public int getQuoteArea() {
		return quoteArea;
	}

	public void setQuoteArea(int quoteArea) {
		this.quoteArea = quoteArea;
	}

	@Column(name = "unitPrice")
	public long getUnitPrice() {
		return unitPrice;
	}

	public void setUnitPrice(long unitPrice) {
		this.unitPrice = unitPrice;
	}

	@Column(name = "costPrice")
	public long getCostPrice() {
		return costPrice;
	}

	public void setCostPrice(long costPrice) {
		this.costPrice = costPrice;
	}

	@Column(name = "profitRate")
	public int getProfitRate() {
		return profitRate;
	}

	public void setProfitRate(int profitRate) {
		this.profitRate = profitRate;
	}

	@Column(name = "offset")
	public long getOffset() {
		return offset;
	}

	public void setOffset(long offset) {
		this.offset = offset;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

	@Column(name = "preferPrice")
	public long getPreferPrice() {
		return preferPrice;
	}

	public void setPreferPrice(long preferPrice) {
		this.preferPrice = preferPrice;
	}

	@Column(name = "mostPrice")
	public long getMostPrice() {
		return mostPrice;
	}

	public void setMostPrice(long mostPrice) {
		this.mostPrice = mostPrice;
	}

	@Column(name = "costRate")
	public int getCostRate() {
		return costRate;
	}

	public void setCostRate(int costRate) {
		this.costRate = costRate;
	}

	@Column(name = "mostRate")
	public int getMostRate() {
		return mostRate;
	}

	public void setMostRate(int mostRate) {
		this.mostRate = mostRate;
	}

	@Column(name = "discount")
	public int getDiscount() {
		return discount;
	}

	public void setDiscount(int discount) {
		this.discount = discount;
	}

	@Column(name = "manageRate")
	public int getManageRate() {
		return manageRate;
	}

	public void setManageRate(int manageRate) {
		this.manageRate = manageRate;
	}
}
