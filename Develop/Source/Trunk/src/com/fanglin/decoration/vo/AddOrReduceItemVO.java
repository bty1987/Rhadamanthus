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

package com.fanglin.decoration.vo;

import java.io.Serializable;

import com.google.gson.annotations.SerializedName;

public class AddOrReduceItemVO implements Serializable {

	private static final long serialVersionUID = -73823844511116014L;
	
	private long autoId;
	
	@SerializedName("增减项编号")
	private int arId;
	
	@SerializedName("报价项类别")
	private int itemType;
	
	@SerializedName("新项目编号")
	private String customerItemId;
	
	@SerializedName("报价项编号")
	private String itemId;
	
	@SerializedName("分类编号")
	private int quotationClassificationId;
	
	@SerializedName("分类")
	private String quotationClassification;

	@SerializedName("大类编号")
	private int quotationBigCategoryId;
	
	@SerializedName("大类")
	private String quotationBigCategory;
	
	@SerializedName("报价项名称")
	private String itemName;
	
	@SerializedName("计量单位")
	private String measurementUnit;
	
	@SerializedName("计量单位编号")
	private int measurementUnitId;
	
	@SerializedName("工种")
	private String workType;
	
	@SerializedName("工种编号")
	private int workTypeId;
	
	@SerializedName("报价项描述")
	protected String quotationItemDes;
	
	@SerializedName("单价")
	private Float unitPrice;
	
	@SerializedName("数量")
	private Float num;
	
	@SerializedName("功能区编号")
	private Long quotationFunctionAreaId;
	
	@SerializedName("功能区名称")
	private String quotationFunctionAreaName;

	
	public AddOrReduceItemVO(){
		
	}
	
	public AddOrReduceItemVO(long autoId){
		this.autoId = autoId;
	}
	
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

	public float getUnitPrice(){
		return unitPrice;
	}

	public void setUnitPrice(float unitPrice){
		this.unitPrice = unitPrice;
	}

	public void setCustomerItemId(String customerItemId){
		this.customerItemId = customerItemId;
	}

	public String getCustomerItemId(){
		return customerItemId;
	}

	public void setArId(int arId){
		this.arId = arId;
	}

	public int getArId(){
		return arId;
	}

	public void setItemType(int itemType){
		this.itemType = itemType;
	}

	public int getItemType(){
		return itemType;
	}

	public void setNum(Float num){
		this.num = num;
	}

	public Float getNum(){
		return num;
	}

	public void setWorkTypeId(int workTypeId){
		this.workTypeId = workTypeId;
	}

	public int getWorkTypeId(){
		return workTypeId;
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

	public void setQuotationBigCategory(String quotationBigCategory){
		this.quotationBigCategory = quotationBigCategory;
	}

	public String getQuotationBigCategory(){
		return quotationBigCategory;
	}

	public void setQuotationBigCategoryId(int quotationBigCategoryId){
		this.quotationBigCategoryId = quotationBigCategoryId;
	}

	public int getQuotationBigCategoryId(){
		return quotationBigCategoryId;
	}

	public void setMeasurementUnitId(int measurementUnitId){
		this.measurementUnitId = measurementUnitId;
	}

	public int getMeasurementUnitId(){
		return measurementUnitId;
	}

	public void setQuotationFunctionAreaName(String quotationFunctionAreaName){
		this.quotationFunctionAreaName = quotationFunctionAreaName;
	}

	public String getQuotationFunctionAreaName(){
		return quotationFunctionAreaName;
	}

	public void setQuotationFunctionAreaId(Long quotationFunctionAreaId){
		this.quotationFunctionAreaId = quotationFunctionAreaId;
	}

	public Long getQuotationFunctionAreaId(){
		return quotationFunctionAreaId;
	}

	public void setQuotationClassificationId(int quotationClassificationId){
		this.quotationClassificationId = quotationClassificationId;
	}

	public int getQuotationClassificationId(){
		return quotationClassificationId;
	}

	public void setQuotationClassification(String quotationClassification){
		this.quotationClassification = quotationClassification;
	}

	public String getQuotationClassification(){
		return quotationClassification;
	}

}
