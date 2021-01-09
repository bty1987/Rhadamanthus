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
import com.fanglin.right.service.CustomerOriginFunctionRightService;
import com.fanglin.right.vo.CustomerOriginFunctionRightVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class CustomerOriginFunctionRightAction extends BaseListAction {

	private static final long serialVersionUID = 8421050272632437026L;

	@Autowired
	private CustomerOriginFunctionRightService customerOriginFunctionRightService;
	
	private List<CustomerOriginFunctionRightVO> customerOriginFunctionRights;
	
	private CustomerOriginFunctionRightVO customerOriginFunctionRight;
	
	private List<Long> cfids;
	
	@Action(value="queryCustomerOriginFunctionRight", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryCustomerOriginFunctionRight() throws FLException{
		
		customerOriginFunctionRights = customerOriginFunctionRightService.queryCustomerOriginFunctionRight(customerOriginFunctionRight);
		
		return SUCCESS;
	}
	
	@Action(value="updateCustomerOriginFunctionRight", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateCustomerOriginFunctionRight() throws FLException{
		
		customerOriginFunctionRightService.updateCustomerOriginFunctionRight(customerOriginFunctionRight, cfids, queryCompany());
		
		return SUCCESS;
	}

	public List<CustomerOriginFunctionRightVO> getCustomerOriginFunctionRights() {
		return customerOriginFunctionRights;
	}

	public void setCustomerOriginFunctionRights(
			List<CustomerOriginFunctionRightVO> customerOriginFunctionRights) {
		this.customerOriginFunctionRights = customerOriginFunctionRights;
	}

	public CustomerOriginFunctionRightVO getCustomerOriginFunctionRight() {
		return customerOriginFunctionRight;
	}

	public void setCustomerOriginFunctionRight(
			CustomerOriginFunctionRightVO customerOriginFunctionRight) {
		this.customerOriginFunctionRight = customerOriginFunctionRight;
	}

	public List<Long> getCfids() {
		return cfids;
	}

	public void setCfids(List<Long> cfids) {
		this.cfids = cfids;
	}

}
