/**
 * @File Name		: AuditIndexAction.java
 * @Package   	: com.fanglin.common.action
 * @Version		: 1.0
 * @Date			: 2015-5-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.index.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;

@ParentPackage("base")
@Namespace("/")
@Controller
public class AuditIndexAction extends BaseListAction {

	private static final long serialVersionUID = -933468696423832653L;
	
	@Action(value = "decorationOrderAuditIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/audit/decorationOrder.html") })
	public String decorationOrderAuditIndex(){
		return SUCCESS;
	}
	
	@Action(value = "decorationOrderDetailAuditIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/audit/decorationOrderDetail.html") })
	public String debgetDecorationOrderDetailIndex(){
		return SUCCESS;
	}
	
	@Action(value = "auditIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/audit/audit.html") })
	public String auditIndex(){
		return SUCCESS;
	}

	@Action(value = "budgetAddOrReduceItemIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/audit/addOrReduceItems.html") })
	public String budgetAddOrReduceItemsIndex(){
		return SUCCESS;
	}

	@Action(value = "chargebackIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/audit/chargeback.html") })
	public String chargebackIndex(){
		return SUCCESS;
	}

}
