package com.fanglin.customer.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.service.CustomerSourceService;
import com.fanglin.customer.vo.CustomerSourceVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class CustomerSourceAction extends BaseListAction {

	private static final long serialVersionUID = 395953005021108806L;

	@Autowired
	private CustomerSourceService customerSourceService;

	private CustomerSourceVO customerSource;

	@Action(value = "pageCustomerSource", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageCustomerSource() throws FLException {

		customerSourceService.pageCustomerSource(getPaging(), getFilters());

		return SUCCESS;
	}

	@Action(value = "addCustomerSource", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addCustomerSource() throws FLException {

		customerSourceService.addCustomerSource(customerSource, queryUserId());

		return SUCCESS;
	}

	@Action(value = "updateCustomerSourceForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateCustomerSourceForStatus() throws FLException {

		customerSourceService.updateCustomerSourceForStatus(customerSource);

		return SUCCESS;
	}

	public CustomerSourceVO getCustomerSource() {
		return customerSource;
	}

	public void setCustomerSource(CustomerSourceVO customerSource) {
		this.customerSource = customerSource;
	}

}
