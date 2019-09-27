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

@ParentPackage("common")
@Namespace("/")
@Controller("Customer4CommonAction")
public class CommonAction extends BaseListAction {

	private static final long serialVersionUID = -2569225332516928302L;

	@Autowired
	private CustomerOriginService customerOriginService;

	private CustomerOriginVO customerOrigin;

	private String securityCode;

	private String verifyCode;

	@Action(value = "queryCustomerOriginByCsid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCustomerOriginByCsid() {

		customerOrigin = customerOriginService.queryCustomerOriginByCsid(customerOrigin);

		return SUCCESS;
	}

	@Action(value = "confirmCustomerOrigin", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String confirmCustomerOrigin() throws FLException {

		customerOriginService.confirmCustomerOrigin(customerOrigin, securityCode, verifyCode);

		return SUCCESS;
	}

	public CustomerOriginVO getCustomerOrigin() {
		return customerOrigin;
	}

	public void setCustomerOrigin(CustomerOriginVO customerOrigin) {
		this.customerOrigin = customerOrigin;
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
