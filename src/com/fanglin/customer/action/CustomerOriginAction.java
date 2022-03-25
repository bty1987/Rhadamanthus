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

	private String user;

	@Action(value = "pageCustomerOrigin", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageCustomerOrigin() throws FLException {

		customerOriginService.pageCustomerOrigin(getPaging(), getFilters(), queryUserId(), user);

		return SUCCESS;
	}

	@Action(value = "pageCustomerOriginForAdvance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageCustomerOriginForAdvance() throws FLException {

		customerOriginService.pageCustomerOriginForAdvance(getPaging(), getFilters(), queryUserId());

		return SUCCESS;
	}

	@Action(value = "addCustomerOrigin", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addCustomerOrigin() throws FLException {

		customerOriginService.addCustomerOrigin(customerOrigin, queryUserId());

		return SUCCESS;
	}

	@Action(value = "updateCustomerOrigin", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateCustomerOrigin() throws FLException {

		customerOriginService.updateCustomerOrigin(customerOrigin, queryUserId());

		return SUCCESS;
	}

	@Action(value = "updateCustomerOriginForBelonger", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateCustomerOriginForBelonger() throws FLException {

		customerOriginService.updateCustomerOriginForBelonger(customerOrigin, queryUserId());

		return SUCCESS;
	}

	@Action(value = "freeCustomerOrigin", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String freeCustomerOrigin() throws FLException {

		customerOriginService.freeCustomerOrigin(customerOrigin, queryUserId());

		return SUCCESS;
	}

	@Action(value = "takeCustomerOrigin", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String takeCustomerOrigin() throws FLException {

		customerOriginService.takeCustomerOrigin(customerOrigin, queryUserId());

		return SUCCESS;
	}

	@Action(value = "bindCustomerOrigin", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String bindCustomerOrigin() throws FLException {

		customerOriginService.bindCustomerOrigin(customerOrigin, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "commitCustomerOrigin", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String commitCustomerOrigin() throws FLException {

		customerOriginService.commitCustomerOrigin(customerOrigin);

		return SUCCESS;
	}

	@Action(value = "cancelCustomerOrigin", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String cancelCustomerOrigin() throws FLException {

		customerOriginService.cancelCustomerOrigin(customerOrigin);

		return SUCCESS;
	}

	public CustomerOriginVO getCustomerOrigin() {
		return customerOrigin;
	}

	public void setCustomerOrigin(CustomerOriginVO customerOrigin) {
		this.customerOrigin = customerOrigin;
	}

	public String getUser() {
		return user;
	}

	public void setUser(String user) {
		this.user = user;
	}

}
