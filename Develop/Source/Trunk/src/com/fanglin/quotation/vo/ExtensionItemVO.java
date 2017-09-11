package com.fanglin.quotation.vo;

import java.io.Serializable;



public class ExtensionItemVO implements Serializable{

	private static final long serialVersionUID = 1874898162310332664L;
	
	private Long eiId;
	
	private Long eid;
	
	private String itemName;
	
	private String measurementUnit;
	
	private String workType;
	
	private Float unitPrice;
	
	private Float num;
	
	private Long quotationFunctionAreaId;
	
	private String quotationFunctionAreaName;
	
	private Long quoteItemId ;
	
	private String content;
	
	private String quotationType;

	public Long getEiId() {
		return eiId;
	}

	public void setEiId(Long eiId) {
		this.eiId = eiId;
	}

	public Long getEid() {
		return eid;
	}

	public void setEid(Long eid) {
		this.eid = eid;
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


}
