/**
 * Title: BudgetAuditVO
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: JH Corporation, China, Ltd.
 * @author Howard
 *
 */

package com.fanglin.audit.vo;

import java.io.Serializable;
import java.util.List;

public class BudgetAuditVO implements Serializable {

	private static final long serialVersionUID = -3467625878964819409L;

	private String orderId;
	
	private String versionId;
	
	private String versionName;
	
	private String orderActivity;
	
	private Float orderTotalPrice;
	
	private Float quotationDiscount;
	
	private Long quotationId;
	
	private String designerId;
	
	private String designer;
	
	private List<BudgetAuditItemVO> budgetAuditItems;
	
	public String getOrderId(){
		return orderId;
	}

	public void setOrderId(String orderId){
		this.orderId = orderId;
	}

	public String getVersionId(){
		return versionId;
	}

	public void setVersionId(String versionId){
		this.versionId = versionId;
	}

	public String getVersionName(){
		return versionName;
	}

	public void setVersionName(String versionName){
		this.versionName = versionName;
	}

	public String getOrderActivity(){
		return orderActivity;
	}

	public void setOrderActivity(String orderActivity){
		this.orderActivity = orderActivity;
	}

	public Float getOrderTotalPrice(){
		return orderTotalPrice;
	}

	public void setOrderTotalPrice(Float orderTotalPrice){
		this.orderTotalPrice = orderTotalPrice;
	}

	public Float getQuotationDiscount(){
		return quotationDiscount;
	}

	public void setQuotationDiscount(Float quotationDiscount){
		this.quotationDiscount = quotationDiscount;
	}
	
	public Long getQuotationId(){
		return quotationId;
	}
	
	public void setQuotationId(Long quotationId){
		this.quotationId = quotationId;
	}
	
	public String getDesignerId(){
		return designerId;
	}

	public void setDesignerId(String designerId){
		this.designerId = designerId;
	}

	public String getDesigner(){
		return designer;
	}

	public void setDesigner(String designer){
		this.designer = designer;
	}

	public List<BudgetAuditItemVO> getBudgetAuditItems(){
		return budgetAuditItems;
	}

	public void setBudgetAuditItems(List<BudgetAuditItemVO> budgetAuditItems){
		this.budgetAuditItems = budgetAuditItems;
	}

	
}
