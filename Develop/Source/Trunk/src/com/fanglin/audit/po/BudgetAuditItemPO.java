/**
 * Title: BudgetAuditPO
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: JH Corporation, China, Ltd.
 * @author bty1987
 */

package com.fanglin.audit.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fanglin.common.po.MeasurementUnitPO;
import com.fanglin.common.po.WorkTypePO;
import com.fanglin.quotation.po.QuotationBigCategoryPO;
import com.fanglin.quotation.po.QuotationFunctionAreaPO;

@Entity
@Table(name = "budgetAudit", catalog = "platform")
public class BudgetAuditItemPO implements Serializable {

	private static final long serialVersionUID = -7382384455543116014L;
	
	public static final String STATUS_ADDED_STR = "已增";
	
	public static final String STATUS_SPECIAL_APPROVAL_STR = "特批";
	
	public static final String STATUS_CHARGEBACK_STR = "扣款";
	
	public static String COLUMN_ORDERID_STR = "orderId";

	private Long auditId;
	
	private String orderId;
	
	private String customerItemId;
	
	private String itemId;
	
	private String itemName;
	
	private int itemType;
	
	private Float unitPrice;
	
	private Float num;
	
	private String status;
	
	private String des; //工艺说明
	
	private String comment; // 操作说明

	private QuotationFunctionAreaPO functionArea;
	
	private QuotationBigCategoryPO category;
	
	private MeasurementUnitPO measurementUnit;
	
	private WorkTypePO workType;

	public BudgetAuditItemPO(){
		super();
	}

	public BudgetAuditItemPO(Long auditId){
		this.auditId = auditId;
	}

	@Id
	@GeneratedValue
	@Column(name = "auditId")
	public Long getAuditId(){
		return auditId;
	}

	public void setAuditId(Long auditId){
		this.auditId = auditId;
	}

	@Column(name = "orderId", nullable = false)
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

	@Column(name = "itemName", nullable = false)
	public String getItemName(){
		return itemName;
	}

	public void setItemName(String itemName){
		this.itemName = itemName;
	}

	@Column(name = "itemType", nullable = false)
	public int getItemType(){
		return itemType;
	}

	public void setItemType(int itemType){
		this.itemType = itemType;
	}

	@Column(name = "unitPrice", nullable = false)
	public Float getUnitPrice(){
		return unitPrice;
	}

	public void setUnitPrice(Float unitPrice){
		this.unitPrice = unitPrice;
	}

	@Column(name = "num", nullable = false)
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

	@javax.persistence.ManyToOne(fetch = FetchType.LAZY)
	@javax.persistence.JoinColumn(nullable = false, name = "functionAreaId", referencedColumnName = "autoId")
	public QuotationFunctionAreaPO getFunctionArea(){
		return functionArea;
	}

	public void setFunctionArea(QuotationFunctionAreaPO functionArea){
		this.functionArea = functionArea;
	}

	@javax.persistence.ManyToOne(fetch = FetchType.LAZY)
	@javax.persistence.JoinColumn(nullable = false, name = "categoryId", referencedColumnName = "id")
	public QuotationBigCategoryPO getCategory(){
		return category;
	}

	public void setCategory(QuotationBigCategoryPO category){
		this.category = category;
	}

	@javax.persistence.ManyToOne(fetch = FetchType.LAZY)
	@javax.persistence.JoinColumn(nullable = false, name = "measurementUnitId", referencedColumnName = "id")
	public MeasurementUnitPO getMeasurementUnit(){
		return measurementUnit;
	}

	public void setMeasurementUnit(MeasurementUnitPO measurementUnit){
		this.measurementUnit = measurementUnit;
	}

	@javax.persistence.ManyToOne(fetch = FetchType.LAZY)
	@javax.persistence.JoinColumn(name = "workTypeId", referencedColumnName = "id")
	public WorkTypePO getWorkType(){
		return workType;
	}

	public void setWorkType(WorkTypePO workType){
		this.workType = workType;
	}

}
