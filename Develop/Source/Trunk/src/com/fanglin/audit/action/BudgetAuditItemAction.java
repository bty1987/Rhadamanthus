/**
 * Title: BudgetAuditAction
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: JH Corporation, China, Ltd.
 * @author Howard
 *
 */

package com.fanglin.audit.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.audit.service.BudgetAuditItemService;
import com.fanglin.audit.vo.BudgetAuditItemVO;
import com.fanglin.audit.vo.BudgetAuditVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class BudgetAuditItemAction extends BaseListAction {

	private static final long serialVersionUID = 245979392876944607L;
	
	@Autowired
	private BudgetAuditItemService budgetAuditItemService;

	private BudgetAuditVO orderAudit;

	private BudgetAuditItemVO auditItem;

	private String orderId;

	@Action(value = "pageBudgetAuditItemByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageBudgetAuditItemByOrderId(){
		
		budgetAuditItemService.pageBudgetAuditItemByOrderId(getPaging(), getFilters(), orderAudit);
		
		return SUCCESS;
	}

	@Action(value = "queryBudgetAuditItemByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryBudgetAuditItemByOrderId(){
		
		orderAudit = budgetAuditItemService.queryBudgetAuditItemByOrderId(orderAudit);
		
		return SUCCESS;
	}

	@Action(value = "addBudgetAuditItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addBudgetAuditItem(){
		
		budgetAuditItemService.addBudgetAuditItem(orderAudit);
		
		return SUCCESS;
	}

	@Action(value = "submitBudgetAuditItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String submitBudgetAuditItem() throws FLException{
		
		budgetAuditItemService.submitBudgetAuditItem(getOrderAudit(), getUserId());
				
		return SUCCESS;
	}

	@Action(value = "changeBudgetAuditItemForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String changeBudgetAuditItemForStatus() throws FLException{
		
		budgetAuditItemService.changeBudgetAuditItemForStatus(auditItem, getUserId());
		
		return SUCCESS;
	}
	
	public BudgetAuditVO getOrderAudit(){
		return orderAudit;
	}

	public void setOrderAudit(BudgetAuditVO orderAudit){
		this.orderAudit = orderAudit;
	}

	public BudgetAuditItemVO getAuditItem(){
		return auditItem;
	}

	public void setAuditItem(BudgetAuditItemVO auditItem){
		this.auditItem = auditItem;
	}

	public String getOrderId(){
		return orderId;
	}

	public void setOrderId(String orderId){
		this.orderId = orderId;
	}
}
