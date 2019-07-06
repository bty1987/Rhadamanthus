package com.fanglin.quotation.vo;

public class AddReduceItemVO implements java.io.Serializable {

	private static final long serialVersionUID = -8622530142993960730L;

	private Long ariId;
	
	private Integer arId;
	
	private String itemName;
	
	private Short type;
	
	private Short subtype;
	
	private String measurementUnit;
	
	private String workType;
	
	private Float addPrice;
	
	private Float unitPrice;
	
	private Float subPrice;
	
	private Float num;
	
	private Long quotationFunctionAreaId;
	
	private String quotationFunctionAreaName;
	
	private Short quotationFunctionAreaType;
	
	private Long quoteItemId;
	
	private String content;
	
	private Short discount;

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

	public Float getAddPrice() {
		return addPrice;
	}

	public void setAddPrice(Float addPrice) {
		this.addPrice = addPrice;
	}

	public Float getUnitPrice() {
		return unitPrice;
	}

	public void setUnitPrice(Float unitPrice) {
		this.unitPrice = unitPrice;
	}

	public Float getSubPrice() {
		return subPrice;
	}

	public void setSubPrice(Float subPrice) {
		this.subPrice = subPrice;
	}

	public Float getNum() {
		return num;
	}

	public void setNum(Float num) {
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
	
	public Short getQuotationFunctionAreaType() {
		return quotationFunctionAreaType;
	}

	public void setQuotationFunctionAreaType(Short quotationFunctionAreaType) {
		this.quotationFunctionAreaType = quotationFunctionAreaType;
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

	public Short getDiscount() {
		return discount;
	}

	public void setDiscount(Short discount) {
		this.discount = discount;
	}

}