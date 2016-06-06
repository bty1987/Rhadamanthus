package com.fanglin.quotation.vo;

import java.io.Serializable;

public class QuotationFunctionAreaItemVO implements Serializable{
	                                                                
	private static final long serialVersionUID = 735430251276046420L;
	
	private Long qfaiId;

	private String itemName;
	
	private Float unitPrice;
	
	private Float num;
	
	private Short type;
	
	private String measurementUnit;
	
	private Long quotationFunctionAreaId;
	
	private Long quotationItemId;
	
	private String content;

	public Long getQfaiId() {
		return qfaiId;
	}

	public void setQfaiId(Long qfaiId) {
		this.qfaiId = qfaiId;
	}

	public String getItemName() {
		return itemName;
	}

	public void setItemName(String itemName) {
		this.itemName = itemName;
	}

	public Float getUnitPrice() {
		return unitPrice;
	}

	public void setUnitPrice(Float unitPrice) {
		this.unitPrice = unitPrice;
	}

	public Float getNum() {
		return num;
	}

	public void setNum(Float num) {
		this.num = num;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public String getMeasurementUnit() {
		return measurementUnit;
	}

	public void setMeasurementUnit(String measurementUnit) {
		this.measurementUnit = measurementUnit;
	}

	public Long getQuotationFunctionAreaId() {
		return quotationFunctionAreaId;
	}

	public void setQuotationFunctionAreaId(Long quotationFunctionAreaId) {
		this.quotationFunctionAreaId = quotationFunctionAreaId;
	}

	public Long getQuotationItemId() {
		return quotationItemId;
	}

	public void setQuotationItemId(Long quotationItemId) {
		this.quotationItemId = quotationItemId;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

}
