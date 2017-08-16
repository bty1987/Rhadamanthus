/**
 * @File Name	: CustomerServiceBackVisitAction.java
 * @Package   	: com.fanglin.action.constructionSchedule
 * @Version		: 1.0
 * @Date		: 2014-9-26
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email		: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.construction.service.CustomerServiceBackVisitService;
import com.fanglin.construction.vo.CustomerServiceBackVisitVO;
import com.fanglin.core.action.BaseListAction;

@ParentPackage("base")
@Namespace("/")
@Controller
public class CustomerServiceBackVisitAction extends BaseListAction{

	private static final long serialVersionUID = -7891221344594615581L;
	
	@Autowired
	private CustomerServiceBackVisitService customerServiceBackVisitService;
	
	private CustomerServiceBackVisitVO customerServiceBackVisit;
	
	private List<String> csbvIds;
	
	@Action(value = "pageCustomerServiceBackVisit", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageCustomerServiceBackVisit(){
		
		customerServiceBackVisitService.pageCustomerServiceBackVisitByOrderId(getPaging(), getFilters(), customerServiceBackVisit);
		
		return SUCCESS;
	}
	
	@Action(value = "addCustomerServiceBackVisit", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addCustomerServiceBackVisit(){
		
		customerServiceBackVisitService.saveOrderUpdateCustomerServiceBackVisit(customerServiceBackVisit);
		
		return SUCCESS;
	}
	
	@Action(value = "updateCustomerServiceBackVisit", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateCustomerServiceBackVisit(){
		
		customerServiceBackVisitService.updateCustomerServiceBackVisit(customerServiceBackVisit);
		
		return SUCCESS;
	}
	
	@Action(value = "deleteCustomerServiceBackVisit", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteCustomerServiceBackVisit(){
		
		customerServiceBackVisitService.deleteCustomerServiceBackVisits(csbvIds);
		
		return SUCCESS;
	}

	public CustomerServiceBackVisitVO getCustomerServiceBackVisit(){
		return customerServiceBackVisit;
	}

	public void setCustomerServiceBackVisit(CustomerServiceBackVisitVO customerServiceBackVisit){
		this.customerServiceBackVisit = customerServiceBackVisit;
	}

	public List<String> getCsbvIds(){
		return csbvIds;
	}

	public void setCsbvIds(List<String> csbvIds){
		this.csbvIds = csbvIds;
	}

}
