/**
 * @File Name		: QuotationItemVO.java
 * @Package   	: com.fanglin.vo
 * @Version		: 1.0
 * @Date			: 2014-7-24
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.quotation.vo;

import java.io.Serializable;

public class QuotationItemVO implements Serializable{

	private static final long serialVersionUID = -629582034818766395L;

	private Long autoId;
	
	private String itemId;
	
	private int quotationTypeId;
	
	private String quotationType;
	
	private int quotationClassificationId;
	
	private String quotationClassification;
	
	private int quotationBigCategoryId;
	
	private String quotationBigCategory;
	
	private int quotationSmallCategoryId;
	
	private String quotationSmallCategory;
	
	private String itemName;
	
	private int measurementUnitId;
	
	private String measurementUnit;
	
	private int workTypeId;
	
	private String workType;
	
	protected String quotationItemDes;
	
	private float unitPrice;
	
	private String versionId;
	
	private String version;
	
	private short status;

	public Long getAutoId(){
		return autoId;
	}

	public void setAutoId(Long autoId){
		this.autoId = autoId;
	}

	public String getItemId(){
		return itemId;
	}

	public void setItemId(String itemId){
		this.itemId = itemId;
	}

	public int getQuotationTypeId(){
		return quotationTypeId;
	}

	public void setQuotationTypeId(int quotationTypeId){
		this.quotationTypeId = quotationTypeId;
	}

	public String getQuotationType(){
		return quotationType;
	}

	public void setQuotationType(String quotationType){
		this.quotationType = quotationType;
	}

	public int getQuotationClassificationId(){
		return quotationClassificationId;
	}

	public void setQuotationClassificationId(int quotationClassificationId){
		this.quotationClassificationId = quotationClassificationId;
	}

	public String getQuotationClassification(){
		return quotationClassification;
	}

	public void setQuotationClassification(String quotationClassification){
		this.quotationClassification = quotationClassification;
	}

	public int getQuotationBigCategoryId(){
		return quotationBigCategoryId;
	}

	public void setQuotationBigCategoryId(int quotationBigCategoryId){
		this.quotationBigCategoryId = quotationBigCategoryId;
	}

	public String getQuotationBigCategory(){
		return quotationBigCategory;
	}

	public void setQuotationBigCategory(String quotationBigCategory){
		this.quotationBigCategory = quotationBigCategory;
	}

	public int getQuotationSmallCategoryId(){
		return quotationSmallCategoryId;
	}

	public void setQuotationSmallCategoryId(int quotationSmallCategoryId){
		this.quotationSmallCategoryId = quotationSmallCategoryId;
	}

	public String getQuotationSmallCategory(){
		return quotationSmallCategory;
	}

	public void setQuotationSmallCategory(String quotationSmallCategory){
		this.quotationSmallCategory = quotationSmallCategory;
	}

	public String getItemName(){
		return itemName;
	}

	public void setItemName(String itemName){
		this.itemName = itemName;
	}

	public int getMeasurementUnitId(){
		return measurementUnitId;
	}

	public void setMeasurementUnitId(int measurementUnitId){
		this.measurementUnitId = measurementUnitId;
	}

	public String getMeasurementUnit(){
		return measurementUnit;
	}

	public void setMeasurementUnit(String measurementUnit){
		this.measurementUnit = measurementUnit;
	}

	public int getWorkTypeId(){
		return workTypeId;
	}

	public void setWorkTypeId(int workTypeId){
		this.workTypeId = workTypeId;
	}

	public String getWorkType(){
		return workType;
	}

	public void setWorkType(String workType){
		this.workType = workType;
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

	public String getVersionId(){
		return versionId;
	}

	public void setVersionId(String versionId){
		this.versionId = versionId;
	}

	public String getVersion(){
		return version;
	}

	public void setVersion(String version){
		this.version = version;
	}

	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}
	
}
