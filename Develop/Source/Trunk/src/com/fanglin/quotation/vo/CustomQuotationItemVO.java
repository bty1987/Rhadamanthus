/**
 * @File Name		: QuotationItemPO.java
 * @Package   	: com.fanglin.entity
 * @Version		: 1.0
 * @Date			: 2014-7-24
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.quotation.vo;

import java.io.Serializable;

public class CustomQuotationItemVO implements Serializable {

	private static final long serialVersionUID = -7382384455543311114L;
	
	private long autoId;
	
	private String itemId;
	
	private String quotationClassification;
	
	private int quotationClassificationId;
	
	private String quotationBigCategory;
	
	private int quotationBigCategoryId;
	
	private String itemName;
	
	private String measurementUnit;
	
	private int measurementUnitId;
	
	private String workType;
	
	private int workTypeId;
	
	protected String quotationItemDes;
	
	private float unitPrice;
	
	private float num;
	
	private Long functionAreaId;
	
	private String functionAreaName;
	
	private String functionAreaType;
	
	private long quotationId;
	
	private String quotationName;
	
	public long getAutoId(){
		return autoId;
	}
	
	public void setAutoId(long autoId){
		this.autoId = autoId;
	}
	
	public String getItemId(){
		return itemId;
	}
	
	public void setItemId(String itemId){
		this.itemId = itemId;
	}
	
	public String getQuotationClassification(){
		return quotationClassification;
	}
	
	public void setQuotationClassification(String quotationClassification){
		this.quotationClassification = quotationClassification;
	}
	
	public int getQuotationClassificationId(){
		return quotationClassificationId;
	}
	
	public void setQuotationClassificationId(int quotationClassificationId){
		this.quotationClassificationId = quotationClassificationId;
	}
	
	public String getQuotationBigCategory(){
		return quotationBigCategory;
	}
	
	public void setQuotationBigCategory(String quotationBigCategory){
		this.quotationBigCategory = quotationBigCategory;
	}
	
	public int getQuotationBigCategoryId(){
		return quotationBigCategoryId;
	}
	
	public void setQuotationBigCategoryId(int quotationBigCategoryId){
		this.quotationBigCategoryId = quotationBigCategoryId;
	}
	
	public String getItemName(){
		return itemName;
	}
	
	public void setItemName(String itemName){
		this.itemName = itemName;
	}
	
	public String getMeasurementUnit(){
		return measurementUnit;
	}
	
	public void setMeasurementUnit(String measurementUnit){
		this.measurementUnit = measurementUnit;
	}
	
	public int getMeasurementUnitId(){
		return measurementUnitId;
	}
	
	public void setMeasurementUnitId(int measurementUnitId){
		this.measurementUnitId = measurementUnitId;
	}
	
	public String getWorkType(){
		return workType;
	}
	
	public void setWorkType(String workType){
		this.workType = workType;
	}
	
	public int getWorkTypeId(){
		return workTypeId;
	}
	
	public void setWorkTypeId(int workTypeId){
		this.workTypeId = workTypeId;
	}
	
	public String getQuotationItemDes(){
		return quotationItemDes;
	}
	
	public void setQuotationItemDes(String quotationItemDes){
		this.quotationItemDes = quotationItemDes;
	}
	
	public float getUnitPrice(){
		return unitPrice;
	}
	
	public void setUnitPrice(float unitPrice){
		this.unitPrice = unitPrice;
	}
	
	public float getNum(){
		return num;
	}
	
	public void setNum(float num){
		this.num = num;
	}
	
	public Long getFunctionAreaId(){
		return functionAreaId;
	}
	
	public void setFunctionAreaId(Long functionAreaId){
		this.functionAreaId = functionAreaId;
	}
	
	public long getQuotationId(){
		return quotationId;
	}
	
	public void setQuotationId(long quotationId){
		this.quotationId = quotationId;
	}
	
	public String getQuotationName(){
		return quotationName;
	}
	
	public void setQuotationName(String quotationName){
		this.quotationName = quotationName;
	}
	
	public String getFunctionAreaName(){
		return functionAreaName;
	}
	
	public void setFunctionAreaName(String functionAreaName){
		this.functionAreaName = functionAreaName;
	}

	public String getFunctionAreaType() {
		return functionAreaType;
	}

	public void setFunctionAreaType(String functionAreaType) {
		this.functionAreaType = functionAreaType;
	}

	
}
