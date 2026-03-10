package com.fanglin.quotation.vo;

import java.io.Serializable;

public class QuotetionFunctionAreaItemVO implements Serializable {

	private static final long serialVersionUID = 1048577783803389862L;

	private Long qfaiId;

	private Long qfaid;

	private Long qiid;

	private String name;

	private Integer addPrice;

	private Integer unitPrice;

	private Integer subPrice;

	private Integer index;

	private String formula;

	private String expres;

	private Integer num;

	private Short type;

	private Short subtype;

	private String measurementUnit;

	private String workType;

	private Short discount;

	private Short isRtem;

	private String quotationRtemId;

	private String content;

	public Long getQfaiId() {
		return qfaiId;
	}

	public void setQfaiId(Long qfaiId) {
		this.qfaiId = qfaiId;
	}

	public Long getQfaid() {
		return qfaid;
	}

	public void setQfaid(Long qfaid) {
		this.qfaid = qfaid;
	}

	public Long getQiid() {
		return qiid;
	}

	public void setQiid(Long qiid) {
		this.qiid = qiid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Integer getAddPrice() {
		return addPrice;
	}

	public void setAddPrice(Integer addPrice) {
		this.addPrice = addPrice;
	}

	public Integer getUnitPrice() {
		return unitPrice;
	}

	public void setUnitPrice(Integer unitPrice) {
		this.unitPrice = unitPrice;
	}

	public Integer getSubPrice() {
		return subPrice;
	}

	public void setSubPrice(Integer subPrice) {
		this.subPrice = subPrice;
	}

	public Integer getIndex() {
		return index;
	}

	public void setIndex(Integer index) {
		this.index = index;
	}

	public String getFormula() {
		return formula;
	}

	public void setFormula(String formula) {
		this.formula = formula;
	}

	public String getExpres() {
		return expres;
	}

	public void setExpres(String expres) {
		this.expres = expres;
	}

	public Integer getNum() {
		return num;
	}

	public void setNum(Integer num) {
		this.num = num;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Short getSubtype() {
		return subtype;
	}

	public void setSubtype(Short subtype) {
		this.subtype = subtype;
	}

	public String getMeasurementUnit() {
		return measurementUnit;
	}

	public void setMeasurementUnit(String measurementUnit) {
		this.measurementUnit = measurementUnit;
	}

	public String getWorkType() {
		return workType;
	}

	public void setWorkType(String workType) {
		this.workType = workType;
	}

	public Short getDiscount() {
		return discount;
	}

	public void setDiscount(Short discount) {
		this.discount = discount;
	}

	public Short getIsRtem() {
		return isRtem;
	}

	public void setIsRtem(Short isRtem) {
		this.isRtem = isRtem;
	}

	public String getQuotationRtemId() {
		return quotationRtemId;
	}

	public void setQuotationRtemId(String quotationRtemId) {
		this.quotationRtemId = quotationRtemId;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

}
