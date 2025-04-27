package com.fanglin.customer.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.service.CustomerProtectRuleService;
import com.fanglin.customer.vo.CustomerProtectRuleVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class CustomerProtectRuleAction extends BaseListAction {

	private static final long serialVersionUID = -1710381221691632204L;

	@Autowired
	private CustomerProtectRuleService customerProtectRuleService;

	private List<CustomerProtectRuleVO> customerProtectRules;

	private CustomerProtectRuleVO customerProtectRule;

	@Action(value = "pageCustomerProtectRule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageCustomerProtectRule() throws FLException {

		customerProtectRuleService.pageCustomerProtectRule(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryCustomerProtectRule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCustomerProtectRule() throws FLException {

		customerProtectRules = customerProtectRuleService.queryCustomerProtectRule(customerProtectRule);

		return SUCCESS;
	}

	@Action(value = "checkCustomerProtectRule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String checkCustomerProtectRule() throws FLException {

		customerProtectRule = customerProtectRuleService.checkCustomerProtectRule(customerProtectRule, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "addCustomerProtectRule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addCustomerProtectRule() throws FLException {

		customerProtectRuleService.addCustomerProtectRule(customerProtectRule, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "deleteCustomerProtectRule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteCustomerProtectRule() throws FLException {

		customerProtectRuleService.deleteCustomerProtectRule(customerProtectRule);

		return SUCCESS;
	}

	public List<CustomerProtectRuleVO> getCustomerProtectRules() {
		return customerProtectRules;
	}

	public void setCustomerProtectRules(List<CustomerProtectRuleVO> customerProtectRules) {
		this.customerProtectRules = customerProtectRules;
	}

	public CustomerProtectRuleVO getCustomerProtectRule() {
		return customerProtectRule;
	}

	public void setCustomerProtectRule(CustomerProtectRuleVO customerProtectRule) {
		this.customerProtectRule = customerProtectRule;
	}

}
