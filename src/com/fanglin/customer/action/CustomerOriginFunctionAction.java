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
import com.fanglin.customer.service.CustomerOriginFunctionService;
import com.fanglin.customer.vo.CustomerOriginFunctionVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class CustomerOriginFunctionAction extends BaseListAction {

	private static final long serialVersionUID = 7969957407596923507L;

	@Autowired
	private CustomerOriginFunctionService customerOriginFunctionService;

	private List<CustomerOriginFunctionVO> customerOriginFunctions;

	private CustomerOriginFunctionVO customerOriginFunction;

	@Action(value = "queryCustomerOriginFunction", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCustomerOriginFunction() throws FLException {

		customerOriginFunctions = customerOriginFunctionService.queryCustomerOriginFunction(customerOriginFunction);

		return SUCCESS;
	}

	public List<CustomerOriginFunctionVO> getCustomerOriginFunctions() {
		return customerOriginFunctions;
	}

	public void setCustomerOriginFunctions(List<CustomerOriginFunctionVO> customerOriginFunctions) {
		this.customerOriginFunctions = customerOriginFunctions;
	}

	public CustomerOriginFunctionVO getCustomerOriginFunction() {
		return customerOriginFunction;
	}

	public void setCustomerOriginFunction(CustomerOriginFunctionVO customerOriginFunction) {
		this.customerOriginFunction = customerOriginFunction;
	}

}
