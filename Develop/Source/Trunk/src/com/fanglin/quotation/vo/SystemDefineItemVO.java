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

import com.google.gson.annotations.SerializedName;

public class SystemDefineItemVO implements Serializable{
	
	private static final long serialVersionUID = -629582034818766395L;

	private Long autoId;
	
	@SerializedName("项目编号")
	private String itemId;
	
	@SerializedName("大类编号")
	private int quotationBigCategoryId;
	
	@SerializedName("大类")
	private String quotationBigCategory;
	
	@SerializedName("项目名")
	private String itemName;
	
	@SerializedName("计量单位编号")
	private int measurementUnitId;

	@SerializedName("计量单位")
	private String measurementUnit;

	@SerializedName("工种编号")
	private int itemWorkTypeId;

	@SerializedName("工种")
	private String itemWorkType;

	@SerializedName("工艺说明")
	protected String quotationItemDes;

	@SerializedName("单价")
	private float unitPrice;
	
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

	public int getItemWorkTypeId(){
		return itemWorkTypeId;
	}

	public void setItemWorkTypeId(int itemWorkTypeId){
		this.itemWorkTypeId = itemWorkTypeId;
	}

	public String getItemWorkType(){
		return itemWorkType;
	}

	public void setItemWorkType(String itemWorkType){
		this.itemWorkType = itemWorkType;
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
	
}
