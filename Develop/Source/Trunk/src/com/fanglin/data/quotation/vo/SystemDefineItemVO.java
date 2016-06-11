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

package com.fanglin.data.quotation.vo;

import java.io.Serializable;

public class SystemDefineItemVO implements Serializable{
	
	private static final long serialVersionUID = -629582034818766395L;

	private Long sdiId;
	
	private String itemId;
	
	private int quotationBigCategoryId;
	
	private String quotationBigCategory;
	
	private String itemName;
	
	private int measurementUnitId;

	private String measurementUnit;

	private int itemWorkTypeId;

	private String itemWorkType;

	protected String quotationItemDes;

	private float unitPrice;
	
	public Long getSdiId(){
		return sdiId;
	}

	public void setSdiId(Long sdiId){
		this.sdiId = sdiId;
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
