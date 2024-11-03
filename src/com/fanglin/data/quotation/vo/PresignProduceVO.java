package com.fanglin.data.quotation.vo;

import java.io.Serializable;

public class PresignProduceVO implements Serializable {

	private static final long serialVersionUID = 8591525621416288771L;

	private Long ppid;

	private QuotationVersionVO version;

	private String name;

	private Long quotePrice;

	private Integer quoteArea;

	private Long unitPrice;

	private Integer discount;

	private Integer manageRate;

	private String manageFormula;

	private Integer taxRate;

	private String taxFormula;

	private Long costPrice;

	private Integer profitRate;

	private Long offset;

	private Short status;

	private Integer company;

	private Long preferPrice;

	private Long mostPrice;

	private Integer costRate;

	private Integer mostRate;

	public PresignProduceVO() {
		super();
	}

	public PresignProduceVO(QuotationVersionVO version) {
		super();
		this.version = version;
	}

	public Long getPpid() {
		return ppid;
	}

	public void setPpid(Long ppid) {
		this.ppid = ppid;
	}

	public QuotationVersionVO getVersion() {
		return version;
	}

	public void setVersion(QuotationVersionVO version) {
		this.version = version;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Long getQuotePrice() {
		return quotePrice;
	}

	public void setQuotePrice(Long quotePrice) {
		this.quotePrice = quotePrice;
	}

	public Integer getQuoteArea() {
		return quoteArea;
	}

	public void setQuoteArea(Integer quoteArea) {
		this.quoteArea = quoteArea;
	}

	public Long getUnitPrice() {
		return unitPrice;
	}

	public void setUnitPrice(Long unitPrice) {
		this.unitPrice = unitPrice;
	}

	public Long getCostPrice() {
		return costPrice;
	}

	public void setCostPrice(Long costPrice) {
		this.costPrice = costPrice;
	}

	public Integer getProfitRate() {
		return profitRate;
	}

	public void setProfitRate(Integer profitRate) {
		this.profitRate = profitRate;
	}

	public Long getOffset() {
		return offset;
	}

	public void setOffset(Long offset) {
		this.offset = offset;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

	public Long getPreferPrice() {
		return preferPrice;
	}

	public void setPreferPrice(Long preferPrice) {
		this.preferPrice = preferPrice;
	}

	public Long getMostPrice() {
		return mostPrice;
	}

	public void setMostPrice(Long mostPrice) {
		this.mostPrice = mostPrice;
	}

	public Integer getCostRate() {
		return costRate;
	}

	public void setCostRate(Integer costRate) {
		this.costRate = costRate;
	}

	public Integer getMostRate() {
		return mostRate;
	}

	public void setMostRate(Integer mostRate) {
		this.mostRate = mostRate;
	}

	public Integer getDiscount() {
		return discount;
	}

	public void setDiscount(Integer discount) {
		this.discount = discount;
	}

	public Integer getManageRate() {
		return manageRate;
	}

	public void setManageRate(Integer manageRate) {
		this.manageRate = manageRate;
	}

	public String getManageFormula() {
		return manageFormula;
	}

	public void setManageFormula(String manageFormula) {
		this.manageFormula = manageFormula;
	}

	public Integer getTaxRate() {
		return taxRate;
	}

	public void setTaxRate(Integer taxRate) {
		this.taxRate = taxRate;
	}

	public String getTaxFormula() {
		return taxFormula;
	}

	public void setTaxFormula(String taxFormula) {
		this.taxFormula = taxFormula;
	}

}
