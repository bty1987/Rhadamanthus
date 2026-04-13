package com.fanglin.communion.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.communion.service.CustomerAccountService;
import com.fanglin.communion.vo.CustomerAccountVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class CustomerAccountAction extends BaseListAction {

	private static final long serialVersionUID = 1L;

	@Autowired
	private CustomerAccountService customerAccountService;

	private CustomerAccountVO customerAccount;

	private List<CustomerAccountVO> customerAccounts;

	@Action(value = "queryCustomerAccount", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCustomerAccount() {

		customerAccounts = customerAccountService.queryCustomerAccount(customerAccount);

		return SUCCESS;
	}

	@Action(value = "queryDefaultCustomerAccount", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDefaultCustomerAccount() {

		customerAccount = customerAccountService.queryDefaultCustomerAccount(customerAccount);

		return SUCCESS;
	}

	@Action(value = "addCustomerAccount", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addCustomerAccount() throws FLException {

		customerAccountService.addCustomerAccount(customerAccount);

		return SUCCESS;
	}

	@Action(value = "updateCustomerAccount", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateCustomerAccount() throws FLException {

		customerAccountService.updateCustomerAccount(customerAccount);

		return SUCCESS;
	}

	@Action(value = "deleteCustomerAccount", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteCustomerAccount() throws FLException {

		customerAccountService.deleteCustomerAccount(customerAccount);

		return SUCCESS;
	}

	@Action(value = "setDefaultCustomerAccount", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String setDefaultCustomerAccount() throws FLException {

		customerAccountService.setDefaultCustomerAccount(customerAccount);

		return SUCCESS;
	}

	public CustomerAccountVO getCustomerAccount() {
		return customerAccount;
	}

	public void setCustomerAccount(CustomerAccountVO customerAccount) {
		this.customerAccount = customerAccount;
	}

	public List<CustomerAccountVO> getCustomerAccounts() {
		return customerAccounts;
	}

	public void setCustomerAccounts(List<CustomerAccountVO> customerAccounts) {
		this.customerAccounts = customerAccounts;
	}

}
