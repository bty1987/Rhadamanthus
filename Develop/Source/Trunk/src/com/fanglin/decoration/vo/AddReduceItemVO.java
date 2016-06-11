package com.fanglin.decoration.vo;

import com.fanglin.data.po.QuotationItemPO;

public class AddReduceItemVO implements java.io.Serializable {

	private static final long serialVersionUID = -8622530142993960730L;

	private Long ariId;
	
	private Integer arId;
	
	private String itemName;
	
	private Short type;
	
	private String measurementUnit;
	
	private Integer workType;
	
	private Double unitPrice;
	
	private Double num;
	
	private Long quotationFunctionAreaId;
	
	private String quotationFunctionAreaName;
	
	private Long quotationItemId;
	
	private String content;

	public Long getAriId() {
		return ariId;
	}

	public void setAriId(Long ariId) {
		this.ariId = ariId;
	}

	public Integer getArId() {
		return arId;
	}

	public void setArId(Integer arId) {
		this.arId = arId;
	}

	public String getItemName() {
		return itemName;
	}

	public void setItemName(String itemName) {
		this.itemName = itemName;
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

	public Integer getWorkType() {
		return workType;
	}

	public void setWorkType(Integer workType) {
		this.workType = workType;
	}

	public Double getUnitPrice() {
		return unitPrice;
	}

	public void setUnitPrice(Double unitPrice) {
		this.unitPrice = unitPrice;
	}

	public Double getNum() {
		return num;
	}

	public void setNum(Double num) {
		this.num = num;
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