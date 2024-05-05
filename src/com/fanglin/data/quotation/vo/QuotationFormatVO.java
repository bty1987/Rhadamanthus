package com.fanglin.data.quotation.vo;

import java.io.Serializable;

import com.fanglin.communion.vo.MeasurementUnitVO;

public class QuotationFormatVO implements Serializable {

	private static final long serialVersionUID = 2680317275282495512L;

	private Long qfid;

	private Long qcid;

	private QuotationCtemVO quotationCtem;

	private String name;

	private String format;

	private String pinyin;

	private Integer price;

	private MeasurementUnitVO unit;

	private Short status;

	public QuotationFormatVO() {
		super();
	}

	public QuotationFormatVO(QuotationCtemVO quotationCtem, MeasurementUnitVO unit) {
		super();
		this.quotationCtem = quotationCtem;
		this.unit = unit;
	}

	public Long getQfid() {
		return qfid;
	}

	public void setQfid(Long qfid) {
		this.qfid = qfid;
	}

	public Long getQcid() {
		return qcid;
	}

	public void setQcid(Long qcid) {
		this.qcid = qcid;
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

	public MeasurementUnitVO getUnit() {
		return unit;
	}

	public void setUnit(MeasurementUnitVO unit) {
		this.unit = unit;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

}
