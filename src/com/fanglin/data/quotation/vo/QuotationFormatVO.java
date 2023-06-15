package com.fanglin.data.quotation.vo;

import java.io.Serializable;

public class QuotationFormatVO implements Serializable {

	private static final long serialVersionUID = 2680317275282495512L;

	private Long qfid;

	private QuotationCtemVO quotationCtem;

	private String name;

	private String format;

	private String pinyin;

	private Integer price;

	private Short status;

	public QuotationFormatVO() {
		super();
	}

	public QuotationFormatVO(QuotationCtemVO quotationCtem) {
		super();
		this.quotationCtem = quotationCtem;
	}

	public Long getQfid() {
		return qfid;
	}

	public void setQfid(Long qfid) {
		this.qfid = qfid;
	}

	public QuotationCtemVO getQuotationCtem() {
		return quotationCtem;
	}

	public void setQuotationCtem(QuotationCtemVO quotationCtem) {
		this.quotationCtem = quotationCtem;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getFormat() {
		return format;
	}

	public void setFormat(String format) {
		this.format = format;
	}

	public String getPinyin() {
		return pinyin;
	}

	public void setPinyin(String pinyin) {
		this.pinyin = pinyin;
	}

	public Integer getPrice() {
		return price;
	}

	public void setPrice(Integer price) {
		this.price = price;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

}
