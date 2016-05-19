package com.fanglin.quotation.vo;

import java.io.Serializable;

public class QuotationFunctionAreaItemVO implements Serializable{
	                                                                
	private static final long serialVersionUID = 735430251276046420L;
	
	private Long qfaiId;

	private String uuid;
	
	private Long itemIdAutoId;
	
	private String itemId;
	
	private String quotationBigCategory;
	
	private Integer quotationBigCategoryId;
	
	private String itemName;
	
	private String measurementUnit;
	
	private Integer measurementUnitId;
	
	private String workType;
	
	private Integer workTypeId;
	
	protected String quotationItemDes;
	
	private Float unitPrice;
	
	private Float num;
	
	private Integer quotationClassificationId;
	
	private String quotationClassification;
	
	private Integer customFlag; // 自定义标识
	
	private String itemType; // 原始报价, 增项, 减项, 扣款, 特批

	private Long functionAreaId;
	
	private String functionAreaName;
	
	public Long getQfaiId() {
		return qfaiId;
	}

	public void setQfaiId(Long qfaiId) {
		this.qfaiId = qfaiId;
	}

	public String getItemId(){
		return itemId;
	}

	public void setItemId(String itemId){
		this.itemId = itemId;
	}

	public String getItemName(){
		return itemName;
	}

	public void setItemName(String itemName){
		this.itemName = itemName;
	}

	public String getQuotationItemDes(){
		return quotationItemDes;
	}

	public void setQuotationItemDes(String quotationItemDes){
		this.quotationItemDes = quotationItemDes;
	}

	public Integer getCustomFlag(){
		return customFlag;
	}

	public void setCustomFlag(Integer customFlag){
		this.customFlag = customFlag;
	}

	public void setUnitPrice(Float unitPrice){
		this.unitPrice = unitPrice;
	}

	public Float getUnitPrice(){
		return unitPrice;
	}

	public void setNum(Float num){
		this.num = num;
	}

	public Float getNum(){
		return num;
	}

	public void setItemIdAutoId(Long itemIdAutoId){
		this.itemIdAutoId = itemIdAutoId;
	}

	public Long getItemIdAutoId(){
		return itemIdAutoId;
	}

	public void setUuid(String uuid){
		this.uuid = uuid;
	}

	public String getUuid(){
		return uuid;
	}

	public void setQuotationBigCategory(String quotationBigCategory){
		this.quotationBigCategory = quotationBigCategory;
	}

	public String getQuotationBigCategory(){
		return quotationBigCategory;
	}

	public void setMeasurementUnit(String measurementUnit){
		this.measurementUnit = measurementUnit;
	}

	public String getMeasurementUnit(){
		return measurementUnit;
	}

	public void setWorkType(String workType){
		this.workType = workType;
	}

	public String getWorkType(){
		return workType;
	}

	public void setWorkTypeId(Integer workTypeId){
		this.workTypeId = workTypeId;
	}

	public Integer getWorkTypeId(){
		return workTypeId;
	}

	public void setMeasurementUnitId(Integer measurementUnitId){
		this.measurementUnitId = measurementUnitId;
	}

	public Integer getMeasurementUnitId(){
		return measurementUnitId;
	}

	public void setQuotationBigCategoryId(Integer quotationBigCategoryId){
		this.quotationBigCategoryId = quotationBigCategoryId;
	}

	public Integer getQuotationBigCategoryId(){
		return quotationBigCategoryId;
	}

	public void setQuotationClassificationId(Integer quotationClassificationId){
		this.quotationClassificationId = quotationClassificationId;
	}

	public Integer getQuotationClassificationId(){
		return quotationClassificationId;
	}

	public void setQuotationClassification(String quotationClassification){
		this.quotationClassification = quotationClassification;
	}

	public String getQuotationClassification(){
		return quotationClassification;
	}

	public void setItemType(String itemType){
		this.itemType = itemType;
	}

	public String getItemType(){
		return itemType;
	}

	public void setFunctionAreaId(Long functionAreaId){
		this.functionAreaId = functionAreaId;
	}

	public Long getFunctionAreaId(){
		return functionAreaId;
	}

	public void setFunctionAreaName(String functionAreaName){
		this.functionAreaName = functionAreaName;
	}

	public String getFunctionAreaName(){
		return functionAreaName;
	}
	
}
