package com.fanglin.decoration.action;


import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.communion.service.CustomerService;
import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("common")
@Namespace("/")
@Controller
public class DecorationCommonAction extends BaseListAction {

	private static final long serialVersionUID = 1619707140383979773L;

	@Autowired
	private CustomerService customerService;

	private CustomerVO customer;

	private String imgbase;

	@Action(value = "signateCustomers", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String signateCustomers() throws FLException {

		customerService.signateCustomer(customer, imgbase);

		return "success";
	}

	public CustomerVO getCustomer() {
		return customer;
	}

	public void setCustomer(CustomerVO customer) {
		this.customer = customer;
	}

	public String getImgbase() {
		return imgbase;
	}

	public void setImgbase(String imgbase) {
		this.imgbase = imgbase;
	}

}
