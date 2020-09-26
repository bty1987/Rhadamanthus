/**
 * Title: CustomerAction
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */

package com.fanglin.communion.action;

import java.util.ArrayList;
import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.common.vo.KeyValueVO;
import com.fanglin.communion.service.CustomerService;
import com.fanglin.communion.vo.CustomerPhoneVO;
import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.utils.SystemConfig;

@ParentPackage("base")
@Namespace("/")
@Controller
public class CustomerAction extends BaseListAction {

	private static final long serialVersionUID = -2224739825533869496L;

	@Autowired
	private CustomerService customerService;

	private CustomerVO customer;

	private List<CustomerPhoneVO> customerPhones;

	private List<KeyValueVO> autoFillCustomer;

	private List<String> autoFillList;

	private List<CustomerVO> customers;

	private CustomerPhoneVO customerPhone;

	private String pinyinName;

	private String redirect;

	private String imgbase;

	@Action(value = "pageCustomer", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageCustomer() throws FLException {

		customerService.pageCustomer(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryCustomerById", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCustomerById() throws FLException {

		customer = customerService.queryCustomerById(customer);

		return SUCCESS;
	}

	@Action(value = "queryCustomerForName", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCustomerForName() throws FLException {

		customers = customerService.queryCustomerForName(pinyinName, queryCompany());

		for (CustomerVO customerVO : customers) {
			KeyValueVO keyValueVO = new KeyValueVO();
			keyValueVO.setKey(String.valueOf(customerVO.getCid()));
			keyValueVO.setValue(customerVO.getName());
			getAutoFillCustomer().add(keyValueVO);
			getAutoFillList().add(customerVO.getName());
		}

		return SUCCESS;
	}

	@Action(value = "queryCustomerPhoneByCid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCustomerPhoneByCid() throws FLException {

		customerPhones = customerService.queryCustomerPhoneByCid(customerPhone);

		return SUCCESS;
	}

	@Action(value = "checkCustomerForPhone", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String checkCustomerForPhone() throws FLException {

		customerService.checkCustomerForPhone(customerPhone, queryCompany());

		return SUCCESS;
	}

	@Action(value = "addCustomer", results = { @org.apache.struts2.convention.annotation.Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addCustomer() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		customerService.addCustomer(customer, queryCompany());

		return "success";
	}

	@Action(value = "existCustomer", results = { @org.apache.struts2.convention.annotation.Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String existCustomer() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		customerService.existCustomer(customer, queryCompany());

		return "success";
	}

	@Action(value = "updateCustomer", results = { @org.apache.struts2.convention.annotation.Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateCustomer() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		customerService.updateCustomer(customer);

		return "success";
	}

	@Action(value = "updateCustomerPhoneForStatus", results = { @org.apache.struts2.convention.annotation.Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateCustomerPhoneForStatus() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		customerService.updateCustomerPhoneForStatus(customerPhone);

		return "success";
	}

	@Action(value = "addCustomerPhone", results = { @org.apache.struts2.convention.annotation.Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addCustomerPhone() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		customerService.addCustomerPhone(customerPhone, queryCompany());

		return "success";
	}

	@Action(value = "updateCustomerPhoneForDefault", results = { @org.apache.struts2.convention.annotation.Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateCustomerPhoneForDefault() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		customerService.updateCustomerPhoneForDefault(customerPhone);

		return "success";
	}

	@Action(value = "registerCustomer", results = { @org.apache.struts2.convention.annotation.Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String registerCustomer() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		customerService.registerCustomer(customer);

		return "success";
	}

	@Action(value = "authCustomer", results = { @org.apache.struts2.convention.annotation.Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String authCustomer() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		redirect = customerService.authCustomer(customer);

		return "success";
	}

	@Action(value = "confirmCustomer", results = { @org.apache.struts2.convention.annotation.Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String confirmCustomer() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		customerService.confirmCustomer(customer);

		return "success";
	}

	public CustomerVO getCustomer() {
		return customer;
	}

	public void setCustomer(CustomerVO customer) {
		this.customer = customer;
	}

	public List<KeyValueVO> getAutoFillCustomer() {
		if (autoFillCustomer == null) {
			autoFillCustomer = new ArrayList<KeyValueVO>();
		}
		return autoFillCustomer;
	}

	public void setAutoFillCustomer(List<KeyValueVO> autoFillCustomer) {
		this.autoFillCustomer = autoFillCustomer;
	}

	public List<String> getAutoFillList() {
		if (autoFillList == null) {
			autoFillList = new ArrayList<String>();
		}
		return autoFillList;
	}

	public void setAutoFillList(List<String> autoFillList) {
		this.autoFillList = autoFillList;
	}

	public CustomerPhoneVO getCustomerPhone() {
		return customerPhone;
	}

	public void setCustomerPhone(CustomerPhoneVO customerPhone) {
		this.customerPhone = customerPhone;
	}

	public List<CustomerPhoneVO> getCustomerPhones() {
		return customerPhones;
	}

	public void setCustomerPhones(List<CustomerPhoneVO> customerPhones) {
		this.customerPhones = customerPhones;
	}

	public String getPinyinName() {
		return pinyinName;
	}

	public void setPinyinName(String pinyinName) {
		this.pinyinName = pinyinName;
	}

	public List<CustomerVO> getCustomers() {
		return customers;
	}

	public void setCustomers(List<CustomerVO> customers) {
		this.customers = customers;
	}

	public String getRedirect() {
		return redirect;
	}

	public void setRedirect(String redirect) {
		this.redirect = redirect;
	}

	public String getImgbase() {
		return imgbase;
	}

	public void setImgbase(String imgbase) {
		this.imgbase = imgbase;
	}

}
