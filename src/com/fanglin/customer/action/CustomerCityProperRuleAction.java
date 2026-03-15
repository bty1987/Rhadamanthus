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
import com.fanglin.customer.service.CustomerCityProperRuleService;
import com.fanglin.customer.vo.CustomerCityProperRuleVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class CustomerCityProperRuleAction extends BaseListAction {

	private static final long serialVersionUID = -1401443324058668724L;

	@Autowired
	private CustomerCityProperRuleService customerCityProperRuleService;

	private CustomerCityProperRuleVO customerCityProperRule;

	private List<CustomerCityProperRuleVO> customerCityProperRules;

	@Action(value = "pageCustomerCityProperRule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageCustomerCityProperRule() throws FLException {

		customerCityProperRuleService.pageCustomerCityProperRule(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryCustomerCityProperRule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCustomerCityProperRule() throws FLException {

		customerCityProperRules = customerCityProperRuleService.queryCustomerCityProperRule(customerCityProperRule, queryCompany());

		return SUCCESS;
	}

	@Action(value = "addCustomerCityProperRule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addCustomerCityProperRule() throws FLException {

		customerCityProperRuleService.addCustomerCityProperRule(customerCityProperRule, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "deleteCustomerCityProperRule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteCustomerCityProperRule() throws FLException {

		customerCityProperRuleService.deleteCustomerCityProperRule(customerCityProperRule);

		return SUCCESS;
	}

	@Action(value = "updateCustomerCityProperRule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateCustomerCityProperRule() throws FLException {

		customerCityProperRuleService.updateCustomerCityProperRule(customerCityProperRule);

		return SUCCESS;
	}

	public CustomerCityProperRuleVO getCustomerCityProperRule() {
		return customerCityProperRule;
	}

	public void setCustomerCityProperRule(CustomerCityProperRuleVO customerCityProperRule) {
		this.customerCityProperRule = customerCityProperRule;
	}

	public List<CustomerCityProperRuleVO> getCustomerCityProperRules() {
		return customerCityProperRules;
	}

	public void setCustomerCityProperRules(List<CustomerCityProperRuleVO> customerCityProperRules) {
		this.customerCityProperRules = customerCityProperRules;
	}

}
