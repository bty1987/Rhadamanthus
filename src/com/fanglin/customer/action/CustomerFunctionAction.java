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
import com.fanglin.customer.service.CustomerFunctionService;
import com.fanglin.customer.vo.CustomerFunctionVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class CustomerFunctionAction extends BaseListAction {

	private static final long serialVersionUID = 7969957407596923507L;

	@Autowired
	private CustomerFunctionService customerFunctionService;

	private List<CustomerFunctionVO> customerFunctions;

	private CustomerFunctionVO customerFunction;

	@Action(value = "queryCustomerFunction", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCustomerFunction() throws FLException {

		customerFunctions = customerFunctionService.queryCustomerFunction(customerFunction);

		return SUCCESS;
	}

	public List<CustomerFunctionVO> getCustomerFunctions() {
		return customerFunctions;
	}

	public void setCustomerFunctions(List<CustomerFunctionVO> customerFunctions) {
		this.customerFunctions = customerFunctions;
	}

	public CustomerFunctionVO getCustomerFunction() {
		return customerFunction;
	}

	public void setCustomerFunction(CustomerFunctionVO customerFunction) {
		this.customerFunction = customerFunction;
	}

}
