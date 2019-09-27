package com.fanglin.quotation.vo;

import java.io.Serializable;

public class ExtensionItemVO implements Serializable {

	private static final long serialVersionUID = 1874898162310332664L;

	private Long eiid;

	private Long eid;

	private Short type;

	private Short subtype;

	private String itemName;

	private String measurementUnit;

	private String workType;

	private Integer addPrice;

	private Integer unitPrice;

	private Integer subPrice;

	private Integer num;

	private Long quotationFunctionAreaId;

	private String quotationFunctionAreaName;

	private Long quoteItemId;

	private String content;

	private String quotationType;

	private Short discount;

	public Long getEiid() {
		return eiid;
	}

	public void setEiid(Long eiid) {
		this.eiid = eiid;
	}

	public Long getEid() {
		return eid;
	}

	public void setEid(Long eid) {
		this.eid = eid;
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

	public Integer getNum() {
		return num;
	}

	public void setNum(Integer num) {
		this.num = num;
	}

	public String getItemName() {
		return itemName;
	}

	public void setItemName(String itemName) {
		this.itemName = itemName;
	}

	public Long getQuotationFunctionAreaId() {
		return quotationFunctionAreaId;
	}

	public void setQuotationFunctionAreaId(Long quotationFunctionAreaId) {
		this.quotationFunctionAreaId = quotationFunctionAreaId;
	}

	public String getQuotationFunctionAreaName() {
		return quotationFunctionAreaName;
	}

	public void setQuotationFunctionAreaName(String quotationFunctionAreaName) {
		this.quotationFunctionAreaName = quotationFunctionAreaName;
	}

	public Long getQuoteItemId() {
		return quoteItemId;
	}

	public void setQuoteItemId(Long quoteItemId) {
		this.quoteItemId = quoteItemId;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public String getQuotationType() {
		return quotationType;
	}

	public void setQuotationType(String quotationType) {
		this.quotationType = quotationType;
	}

	public Short getDiscount() {
		return discount;
	}

	public void setDiscount(Short discount) {
		this.discount = discount;
	}

}
