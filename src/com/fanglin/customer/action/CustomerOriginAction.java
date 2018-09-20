package com.fanglin.customer.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.service.CustomerOriginService;
import com.fanglin.customer.vo.CustomerOriginVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class CustomerOriginAction extends BaseListAction {
	
	private static final long serialVersionUID = 7995560520709239543L;
	
	@Autowired
	private CustomerOriginService customerOriginService;
	
	private CustomerOriginVO customerOrigin;
	
	@Action(value = "pageCustomerOrigin", results = { @Result ( name= "success", type= "json", params= {"ignoreHierarchy", "false"}) }, params = {"contentType", "text/html"})
	public String pageCustomerOrigin() throws FLException{
		
		customerOriginService.pageCustomerOrigin(getPaging(), getFilters(), queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "pageCustomerOriginForAdvance", results = { @Result ( name = "success", type = "json", params = {"ignoreHierarchy", "false"}) }, params = {"contentType", "text/html"})
	public String pageCustomerOriginForAdvance() throws FLException{
		
		customerOriginService.pageCustomerOriginForAdvance(getPaging(), getFilters(), queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "pageCustomerOriginForCommunion", results = { @Result ( name = "success", type = "json", params = {"ignoreHierarchy", "false"}) }, params = {"contentType", "text/html"})
	public String pageCustomerOriginForCommunion() throws FLException{
		
		customerOriginService.pageCustomerOriginForCommunion(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value = "addCustomerOrigin", results = { @Result ( name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addCustomerOrigin() throws FLException{
		
		customerOriginService.addCustomerOrigin(customerOrigin, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "updateCustomerOrigin", results = { @Result ( name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateCustomerOrigin() throws FLException{
		
		customerOriginService.updateCustomerOrigin(customerOrigin, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "updateCustomerOriginForBelonger", results = { @Result ( name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateCustomerOriginForBelonger() throws FLException{
		
		customerOriginService.updateCustomerOriginForBelonger(customerOrigin, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "freeCustomerOrigin", results = { @Result ( name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String freeCustomerOrigin() throws FLException{
		
		customerOriginService.freeCustomerOrigin(customerOrigin, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "takeCustomerOrigin", results = { @Result ( name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String takeCustomerOrigin() throws FLException{
		
		customerOriginService.takeCustomerOrigin(customerOrigin, queryUserId());
		
		return SUCCESS;
	}

	public CustomerOriginVO getCustomerOrigin() {
		return customerOrigin;
	}

	public void setCustomerOrigin(CustomerOriginVO customerOrigin) {
		this.customerOrigin = customerOrigin;
	}
	
	
}
