package com.fanglin.right.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.right.service.CustomerFunctionRightService;
import com.fanglin.right.vo.CustomerFunctionRightVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class CustomerFunctionRightAction extends BaseListAction {

	private static final long serialVersionUID = 8421050272632437026L;

	@Autowired
	private CustomerFunctionRightService customerFunctionRightService;

	private List<CustomerFunctionRightVO> customerFunctionRights;

	private CustomerFunctionRightVO customerFunctionRight;

	private List<Long> cfids;

	private List<String> companys;
	
	@Action(value="queryCustomerFunctionRight", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryCustomerFunctionRight() throws FLException{
		
		customerFunctionRights = customerFunctionRightService.queryCustomerFunctionRight(customerFunctionRight, queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value="updateCustomerFunctionRight", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateCustomerFunctionRight() throws FLException{

		customerFunctionRightService.updateCustomerFunctionRight(customerFunctionRight, cfids, queryCompany());

		return SUCCESS;
	}

	@Action(value = "syncCustomerFunctionRight", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String syncCustomerFunctionRight() throws FLException {

		customerFunctionRightService.syncCustomerFunctionRight(customerFunctionRight, companys, queryCompany());

		return SUCCESS;
	}

	public List<CustomerFunctionRightVO> getCustomerFunctionRights() {
		return customerFunctionRights;
	}

	public void setCustomerFunctionRights(
			List<CustomerFunctionRightVO> customerFunctionRights) {
		this.customerFunctionRights = customerFunctionRights;
	}

	public CustomerFunctionRightVO getCustomerFunctionRight() {
		return customerFunctionRight;
	}

	public void setCustomerFunctionRight(
			CustomerFunctionRightVO customerFunctionRight) {
		this.customerFunctionRight = customerFunctionRight;
	}

	public List<Long> getCfids() {
		return cfids;
	}

	public void setCfids(List<Long> cfids) {
		this.cfids = cfids;
	}

	public List<String> getCompanys() {
		return companys;
	}

	public void setCompanys(List<String> companys) {
		this.companys = companys;
	}

}
