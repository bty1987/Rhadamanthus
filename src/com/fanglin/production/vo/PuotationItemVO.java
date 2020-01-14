package com.fanglin.production.vo;

import java.io.Serializable;

public class PuotationItemVO implements Serializable {

	private static final long serialVersionUID = -6219874712653382408L;

	private Long qiid;

	private Long qid;

	private String name;

	private String format;

	private Integer height;

	private Integer width;

	private Integer thick;

	private Integer unitPrice;

	private Integer num;

	private Long total;

	private String measurementUnit;

	private String comment;

	private String specil;

	private String quoteType;

	public Long getQiid() {
		return qiid;
	}

	public void setQiid(Long qiid) {
		this.qiid = qiid;
	}

	public Long getQid() {
		return qid;
	}

	public void setQid(Long qid) {
		this.qid = qid;
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

	public Integer getHeight() {
		return height;
	}

	public void setHeight(Integer height) {
		this.height = height;
	}

	public Integer getWidth() {
		return width;
	}

	public void setWidth(Integer width) {
		this.width = width;
	}

	public Integer getThick() {
		return thick;
	}

	public void setThick(Integer thick) {
		this.thick = thick;
	}

	public Integer getUnitPrice() {
		return unitPrice;
	}

	public void setUnitPrice(Integer unitPrice) {
		this.unitPrice = unitPrice;
	}

	public Integer getNum() {
		return num;
	}

	public void setNum(Integer num) {
		this.num = num;
	}

	public Long getTotal() {
		return total;
	}

	public void setTotal(Long total) {
		this.total = total;
	}

	public String getMeasurementUnit() {
		return measurementUnit;
	}

	public void setMeasurementUnit(String measurementUnit) {
		this.measurementUnit = measurementUnit;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public String getSpecil() {
		return specil;
	}

	public void setSpecil(String specil) {
		this.specil = specil;
	}

	public String getQuoteType() {
		return quoteType;
	}

	public void setQuoteType(String quoteType) {
		this.quoteType = quoteType;
	}

}
