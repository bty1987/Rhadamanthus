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
import com.fanglin.customer.service.CustomerProfileService;
import com.fanglin.customer.vo.CustomerProfileVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class CustomerProfileAction extends BaseListAction {

	private static final long serialVersionUID = -8203746982626094102L;

	@Autowired
	private CustomerProfileService customerProfileService;

	private CustomerProfileVO customerProfile;

	private List<CustomerProfileVO> customerProfiles;

	@Action(value = "pageCustomerProfile", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageCustomerProfile() throws FLException {

		customerProfileService.pageCustomerProfile(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryCustomerProfileByCsid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCustomerProfileByCsid() throws FLException {

		customerProfiles = customerProfileService.queryCustomerProfileByCsid(customerProfile);

		return SUCCESS;
	}

	@Action(value = "queryCustomerProfileByCid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCustomerProfileByCid() throws FLException {

		customerProfiles = customerProfileService.queryCustomerProfileByCid(customerProfile);

		return SUCCESS;
	}

	@Action(value = "queryCustomerProfileByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCustomerProfileByOrderId() throws FLException {

		customerProfiles = customerProfileService.queryCustomerProfileByOrderId(customerProfile);

		return SUCCESS;
	}

	@Action(value = "queryCustomerProfileByCpid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCustomerProfileBySid() throws FLException {

		customerProfile = customerProfileService.queryCustomerProfileByCpid(customerProfile);

		return SUCCESS;
	}

	@Action(value = "addCustomerProfile", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addCustomerProfile() throws FLException {

		customerProfileService.addCustomerProfile(customerProfile, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "makeCustomerProfile", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String makeCustomerProfile() throws FLException {

		customerProfileService.makeCustomerProfile(customerProfile, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "handleCustomerProfile", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String handleCustomerProfile() throws FLException {

		customerProfileService.handleCustomerProfile(customerProfile);

		return SUCCESS;
	}

	public CustomerProfileVO getCustomerProfile() {
		return customerProfile;
	}

	public void setCustomerProfile(CustomerProfileVO customerProfile) {
		this.customerProfile = customerProfile;
	}

	public List<CustomerProfileVO> getCustomerProfiles() {
		return customerProfiles;
	}

	public void setCustomerProfiles(List<CustomerProfileVO> customerProfiles) {
		this.customerProfiles = customerProfiles;
	}

}
