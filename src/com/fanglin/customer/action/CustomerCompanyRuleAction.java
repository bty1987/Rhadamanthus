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
import com.fanglin.customer.service.CustomerCompanyRuleService;
import com.fanglin.customer.vo.CustomerCompanyRuleVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class CustomerCompanyRuleAction extends BaseListAction {

	private static final long serialVersionUID = -1401443324058668723L;

	@Autowired
	private CustomerCompanyRuleService customerCompanyRuleService;

	private CustomerCompanyRuleVO customerCompanyRule;

	private List<CustomerCompanyRuleVO> customerCompanyRules;

	@Action(value = "pageCustomerCompanyRule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageCustomerCompanyRule() throws FLException {

		customerCompanyRuleService.pageCustomerCompanyRule(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryCustomerCompanyRule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCustomerCompanyRule() throws FLException {

		customerCompanyRules = customerCompanyRuleService.queryCustomerCompanyRule(customerCompanyRule, queryCompany());

		return SUCCESS;
	}

	@Action(value = "addCustomerCompanyRule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addCustomerCompanyRule() throws FLException {

		customerCompanyRuleService.addCustomerCompanyRule(customerCompanyRule, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "deleteCustomerCompanyRule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteCustomerCompanyRule() throws FLException {

		customerCompanyRuleService.deleteCustomerCompanyRule(customerCompanyRule);

		return SUCCESS;
	}

	public CustomerCompanyRuleVO getCustomerCompanyRule() {
		return customerCompanyRule;
	}

	public void setCustomerCompanyRule(CustomerCompanyRuleVO customerCompanyRule) {
		this.customerCompanyRule = customerCompanyRule;
	}

	public List<CustomerCompanyRuleVO> getCustomerCompanyRules() {
		return customerCompanyRules;
	}

	public void setCustomerCompanyRules(List<CustomerCompanyRuleVO> customerCompanyRules) {
		this.customerCompanyRules = customerCompanyRules;
	}

}
