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
import com.fanglin.customer.service.CustomerDeptRuleService;
import com.fanglin.customer.vo.CustomerDeptRuleVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class CustomerDeptRuleAction extends BaseListAction {

	private static final long serialVersionUID = -7364698689627625808L;

	@Autowired
	private CustomerDeptRuleService customerDeptRuleService;

	private CustomerDeptRuleVO customerDeptRule;

	private List<CustomerDeptRuleVO> customerDeptRules;

	@Action(value = "pageCustomerDeptRule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageCustomerDeptRule() throws FLException {

		customerDeptRuleService.pageCustomerDeptRule(getPaging(), getFilters());

		return SUCCESS;
	}

	@Action(value = "queryCustomerDeptRule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCustomerDeptRule() throws FLException {

		customerDeptRules = customerDeptRuleService.queryCustomerDeptRule(customerDeptRule);

		return SUCCESS;
	}

	@Action(value = "deleteCustomerDeptRule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteCustomerDeptRule() throws FLException {

		customerDeptRuleService.deleteCustomerDeptRule(customerDeptRule);

		return SUCCESS;
	}

	public CustomerDeptRuleVO getCustomerDeptRule() {
		return customerDeptRule;
	}

	public void setCustomerDeptRule(CustomerDeptRuleVO customerDeptRule) {
		this.customerDeptRule = customerDeptRule;
	}

	public List<CustomerDeptRuleVO> getCustomerDeptRules() {
		return customerDeptRules;
	}

	public void setCustomerDeptRules(List<CustomerDeptRuleVO> customerDeptRules) {
		this.customerDeptRules = customerDeptRules;
	}

}
