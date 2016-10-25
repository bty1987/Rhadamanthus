package com.fanglin.quotation.vo;

public class QuotationMaterialItemVO implements java.io.Serializable {

	private static final long serialVersionUID = -2104165919741560073L;

	private Long qmiId;
	
	private Long qid;
	
	private String no;
	
	private String name;
	
	private String category;
	
	private String brand;
	
	private String measurementUnit;
	
	private Float price;
	
	private Float diff;
	
	private Short status;
	
	private String des;

	public Long getQmiId() {
		return qmiId;
	}

	public void setQmiId(Long qmiId) {
		this.qmiId = qmiId;
	}

	public Long getQid() {
		return qid;
	}

	public void setQid(Long qid) {
		this.qid = qid;
	}

	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public String getBrand() {
		return brand;
	}

	public void setBrand(String brand) {
		this.brand = brand;
	}

	public String getMeasurementUnit() {
		return measurementUnit;
	}

	public void setMeasurementUnit(String measurementUnit) {
		this.measurementUnit = measurementUnit;
	}

	public Float getPrice() {
		return price;
	}

	public void setPrice(Float price) {
		this.price = price;
	}

	public Float getDiff() {
		return diff;
	}

	public void setDiff(Float diff) {
		this.diff = diff;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public String getDes() {
		return des;
	}

	public void setDes(String des) {
		this.des = des;
	}

}