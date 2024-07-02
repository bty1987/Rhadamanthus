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
import com.fanglin.customer.vo.CustomerChanceVO;
import com.fanglin.customer.vo.CustomerSourceVO;
import com.fanglin.system.service.impl.CompanyServiceImpl;
import com.fanglin.utils.FormatUtil;

@ParentPackage("base")
@Namespace("/")
@Controller
public class CustomerSourceAction extends BaseListAction {

	private static final long serialVersionUID = 395953005021108806L;

	@Autowired
	private CustomerSourceService customerSourceService;

	private CustomerSourceVO customerSource;

	private CustomerChanceVO customerChance;

	private String company;

	@Action(value = "pageCustomerSource", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageCustomerSource() throws FLException {

		customerSourceService.pageCustomerSource(getPaging(), getFilters(), customerSource);

		return SUCCESS;
	}

	@Action(value = "queryCustomerSource", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCustomerSource() throws FLException {

		customerSource = customerSourceService.queryCustomerSource(customerSource);

		return SUCCESS;
	}

	@Action(value = "addCustomerSource", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addCustomerSource() throws FLException {

		customerSourceService.addCustomerSource(customerSource, queryUserId());

		return SUCCESS;
	}

	@Action(value = "updateCustomerSource", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateCustomerSource() throws FLException {

		customerSourceService.updateCustomerSource(customerSource);

		return SUCCESS;
	}

	@Action(value = "updateCustomerSourceForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateCustomerSourceForStatus() throws FLException {

		customerSourceService.updateCustomerSourceForStatus(customerSource);

		return SUCCESS;
	}

	@Action(value = "issueCustomerSource", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String issueCustomerSource() throws FLException {

		customerSourceService.issueCustomerSource(customerSource, customerChance, queryUserId(), company != null ? CompanyServiceImpl.decode(company) : queryCompany());

		return SUCCESS;
	}

	public CustomerSourceVO getCustomerSource() {
		return customerSource;
	}

	public void setCustomerSource(CustomerSourceVO customerSource) {
		this.customerSource = customerSource;
	}

	public CustomerChanceVO getCustomerChance() {
		return customerChance;
	}

	public void setCustomerChance(CustomerChanceVO customerChance) {
		this.customerChance = customerChance;
	}

	public String getCompany() {
		return company;
	}

	public void setCompany(String company) {
		this.company = company;
	}

	public static void main(String[] args) {
		System.out.println(FormatUtil.decodeCompany("DmxbFnC3r1YgOMUmcVyOLQ=="));
	}
}
