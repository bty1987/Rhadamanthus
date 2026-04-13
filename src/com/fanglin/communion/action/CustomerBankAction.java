package com.fanglin.communion.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.communion.service.CustomerBankService;
import com.fanglin.communion.vo.CustomerBankVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class CustomerBankAction extends BaseListAction {

	private static final long serialVersionUID = 1L;

	@Autowired
	private CustomerBankService customerBankService;

	private CustomerBankVO customerBank;

	private List<CustomerBankVO> customerBanks;

	@Action(value = "queryCustomerBank", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCustomerBank() {

		customerBanks = customerBankService.queryCustomerBank(customerBank);

		return SUCCESS;
	}

	@Action(value = "queryDefaultCustomerBank", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDefaultCustomerBank() {

		customerBank = customerBankService.queryDefaultCustomerBank(customerBank);

		return SUCCESS;
	}

	@Action(value = "addCustomerBank", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addCustomerBank() throws FLException {

		customerBankService.addCustomerBank(customerBank);

		return SUCCESS;
	}

	@Action(value = "updateCustomerBank", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateCustomerBank() throws FLException {

		customerBankService.updateCustomerBank(customerBank);

		return SUCCESS;
	}

	@Action(value = "deleteCustomerBank", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteCustomerBank() throws FLException {

		customerBankService.deleteCustomerBank(customerBank);

		return SUCCESS;
	}

	@Action(value = "setDefaultCustomerBank", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String setDefaultCustomerBank() throws FLException {

		customerBankService.setDefaultCustomerBank(customerBank);

		return SUCCESS;
	}

	public CustomerBankVO getCustomerBank() {
		return customerBank;
	}

	public void setCustomerBank(CustomerBankVO customerBank) {
		this.customerBank = customerBank;
	}

	public List<CustomerBankVO> getCustomerBanks() {
		return customerBanks;
	}

	public void setCustomerBanks(List<CustomerBankVO> customerBanks) {
		this.customerBanks = customerBanks;
	}

}
