package com.fanglin.customer.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.service.CustomerChanceService;
import com.fanglin.customer.vo.CustomerChanceVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class CustomerChanceAction extends BaseListAction {

	private static final long serialVersionUID = -1512449361068568516L;

	@Autowired
	private CustomerChanceService customerChanceService;

	private CustomerChanceVO customerChance;

	private String securityCode;

	private String verifyCode;

	@Action(value = "pageCustomerChance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageCustomerChance() throws FLException {

		customerChanceService.pageCustomerChance(getPaging(), getFilters(), queryUserId());

		return SUCCESS;
	}

	@Action(value = "issueCustomerChance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String issueCustomerChance() throws FLException {

		customerChanceService.issueCustomerChance(customerChance, queryUserId());

		return SUCCESS;
	}

	@Action(value = "disableCustomerChance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String disableCustomerChance() throws FLException {

		customerChanceService.disableCustomerChance(customerChance, queryUserId());

		return SUCCESS;
	}

	@Action(value = "sendCustomerChance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String sendCustomerChance() throws FLException {

		customerChanceService.sendCustomerChance(customerChance, queryUserId());

		return SUCCESS;
	}

	@Action(value = "confirmCustomerChange", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String confirmCustomerChange() throws FLException {

		customerChanceService.confirmCustomerChange(customerChance, securityCode, verifyCode);

		return SUCCESS;
	}

	public CustomerChanceVO getCustomerChance() {
		return customerChance;
	}

	public void setCustomerChance(CustomerChanceVO customerChance) {
		this.customerChance = customerChance;
	}

	public String getSecurityCode() {
		return securityCode;
	}

	public void setSecurityCode(String securityCode) {
		this.securityCode = securityCode;
	}

	public String getVerifyCode() {
		return verifyCode;
	}

	public void setVerifyCode(String verifyCode) {
		this.verifyCode = verifyCode;
	}

}
