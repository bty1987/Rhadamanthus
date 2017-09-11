package com.fanglin.production.vo;

import java.io.Serializable;

public class PuoteItemVO implements Serializable{
	
	
	private static final long serialVersionUID = -551178681762616111L;

	private Long qiid;
	
	private String name;
	
	private String pinyin;
	
	private String format;
	
	private String measurementunit;
	
	private Float unitprice;
	
	private Short status;
	
	private Integer company;
	
	private QuoteTypeVO quoteType;

	public PuoteItemVO() {
		super();
	}

	public PuoteItemVO(QuoteTypeVO quoteType) {
		super();
		
		this.quoteType = quoteType;
	}

	public Long getQiid() {
		return qiid;
	}

	public void setQiid(long qiid) {
		this.qiid = qiid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPinyin() {
		return pinyin;
	}

	public void setPinyin(String pinyin) {
		this.pinyin = pinyin;
	}

	public String getFormat() {
		return format;
	}

	public void setFormat(String format) {
		this.format = format;
	}

	public String getMeasurementunit() {
		return measurementunit;
	}

	public void setMeasurementunit(String measurementunit) {
		this.measurementunit = measurementunit;
	}

	public Float getUnitprice() {
		return unitprice;
	}

	public void setUnitprice(float unitprice) {
		this.unitprice = unitprice;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

	public QuoteTypeVO getQuoteType() {
		return quoteType;
	}

	public void setQuoteType(QuoteTypeVO quoteType) {
		this.quoteType = quoteType;
	}

	
	
}
