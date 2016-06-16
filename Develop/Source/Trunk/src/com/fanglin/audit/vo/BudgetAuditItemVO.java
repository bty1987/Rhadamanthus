/**
 * Title: BudgetAuditVO
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: JH Corporation, China, Ltd.
 * @author bty1987
 */

package com.fanglin.audit.vo;

import java.io.Serializable;

import com.google.gson.annotations.SerializedName;

public class BudgetAuditItemVO implements Serializable {

	private static final long serialVersionUID = -3467625878964819409L;

	@SerializedName("自增ID")
	private Long auditId;
	
	@SerializedName("订单ID")
	private String orderId;
	
	@SerializedName("客户ID")
	private String customerItemId;
	
	@SerializedName("项目ID")
	private String itemId;
	
	@SerializedName("项目名称")
	private String itemName;
	
	@SerializedName("项目类型")
	private int itemType;
	
	@SerializedName("单价")
	private Float unitPrice;
	
	@SerializedName("数量")
	private Float num;
	
	@SerializedName("状态")
	private String status;
	
	@SerializedName("工艺")
	private String des;
	
	@SerializedName("审批说明")
	private String comment;
	
	@SerializedName("功能区ID")
	private Long functionAreaId;
	
	@SerializedName("功能区名称")
	private String functionAreaName;
	
	@SerializedName("大类ID")
	private Integer categoryId;
	
	@SerializedName("大类名称")
	private String categoryName;
	
	@SerializedName("计量单位ID")
	private Integer measurementUnitId;
	
	@SerializedName("计量单位名称")
	private String measurementUnitName;
	
	@SerializedName("工种ID")
	private Integer workTypeId;
	
	@SerializedName("工种名称")
	private String workTypeName;

	public BudgetAuditItemVO(){
		super();
	}

	public BudgetAuditItemVO(Long auditId){
		this.auditId = auditId;
	}

	public Long getAuditId(){
		return auditId;
	}

	public void setAuditId(Long auditId){
		this.auditId = auditId;
	}

	public String getOrderId(){
		return orderId;
	}

	public void setOrderId(String orderId){
		this.orderId = orderId;
	}

	public String getCustomerItemId(){
		return customerItemId;
	}

	public void setCustomerItemId(String customerItemId){
		this.customerItemId = customerItemId;
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

	public int getItemType(){
		return itemType;
	}

	public void setItemType(int itemType){
		this.itemType = itemType;
	}

	public Float getUnitPrice(){
		return unitPrice;
	}

	public void setUnitPrice(Float unitPrice){
		this.unitPrice = unitPrice;
	}

	public Float getNum(){
		return num;
	}

	public void setNum(Float num){
		this.num = num;
	}

	public String getStatus(){
		return status;
	}

	public void setStatus(String status){
		this.status = status;
	}

	public String getDes(){
		return des;
	}

	public void setDes(String des){
		this.des = des;
	}

	public String getComment(){
		return comment;
	}

	public void setComment(String comment){
		this.comment = comment;
	}

	public Long getFunctionAreaId(){
		return functionAreaId;
	}

	public void setFunctionAreaId(Long functionAreaId){
		this.functionAreaId = functionAreaId;
	}

	public String getFunctionAreaName(){
		return functionAreaName;
	}

	public void setFunctionAreaName(String functionAreaName){
		this.functionAreaName = functionAreaName;
	}

	public Integer getCategoryId(){
		return categoryId;
	}

	public void setCategoryId(Integer categoryId){
		this.categoryId = categoryId;
	}

	public String getCategoryName(){
		return categoryName;
	}

	public void setCategoryName(String categoryName){
		this.categoryName = categoryName;
	}

	public Integer getMeasurementUnitId(){
		return measurementUnitId;
	}

	public void setMeasurementUnitId(Integer measurementUnitId){
		this.measurementUnitId = measurementUnitId;
	}

	public String getMeasurementUnitName(){
		return measurementUnitName;
	}

	public void setMeasurementUnitName(String measurementUnitName){
		this.measurementUnitName = measurementUnitName;
	}

	public Integer getWorkTypeId(){
		return workTypeId;
	}

	public void setWorkTypeId(Integer workTypeId){
		this.workTypeId = workTypeId;
	}

	public String getWorkTypeName(){
		return workTypeName;
	}

	public void setWorkTypeName(String workTypeName){
		this.workTypeName = workTypeName;
	}

}
