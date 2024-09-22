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
import com.fanglin.customer.service.CustomerUserRuleService;
import com.fanglin.customer.vo.CustomerUserRuleVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class CustomerUserRuleAction extends BaseListAction {

	private static final long serialVersionUID = -6686152596675155874L;

	@Autowired
	private CustomerUserRuleService customerUserRuleService;

	private List<CustomerUserRuleVO> customerUserRules;

	private CustomerUserRuleVO customerUserRule;

	@Action(value = "pageCustomerUserRule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageCustomerUserRule() throws FLException {

		customerUserRuleService.pageCustomerUserRule(getPaging(), getFilters(), customerUserRule, queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryCustomerUserRule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCustomerUserRule() throws FLException {

		customerUserRule = customerUserRuleService.queryCustomerUserRule(customerUserRule);

		return SUCCESS;
	}

	@Action(value = "addCustomerUserRule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addCustomerUserRule() throws FLException {

		customerUserRuleService.addCustomerUserRule(customerUserRule, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "updateCustomerUserRule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateCustomerUserRule() throws FLException {

		customerUserRuleService.updateCustomerUserRule(customerUserRule, queryUserId());

		return SUCCESS;
	}

	@Action(value = "updateCustomerUserRuleForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateCustomerUserRuleForStatus() throws FLException {

		customerUserRuleService.updateCustomerUserRuleForStatus(customerUserRule, queryUserId());

		return SUCCESS;
	}

	@Action(value = "disableCustomerUserRule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String disableCustomerUserRule() throws FLException {

		customerUserRuleService.disableCustomerUserRule(queryCompany());

		return SUCCESS;
	}

	public List<CustomerUserRuleVO> getCustomerUserRules() {
		return customerUserRules;
	}

	public void setCustomerUserRules(List<CustomerUserRuleVO> customerUserRules) {
		this.customerUserRules = customerUserRules;
	}

	public CustomerUserRuleVO getCustomerUserRule() {
		return customerUserRule;
	}

	public void setCustomerUserRule(CustomerUserRuleVO customerUserRule) {
		this.customerUserRule = customerUserRule;
	}

}
