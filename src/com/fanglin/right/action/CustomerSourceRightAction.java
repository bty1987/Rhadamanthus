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
import com.fanglin.personel.vo.UserVO;
import com.fanglin.right.service.CustomerSourceRightService;

@ParentPackage("base")
@Namespace("/")
@Controller
public class CustomerSourceRightAction extends BaseListAction {

	private static final long serialVersionUID = 2597130375439493479L;
	
	@Autowired
	private CustomerSourceRightService customerSourceRightService;
	
	private List<Integer> dids;

	private UserVO user;

	@Action(value="queryCustomerSourceDepartmentRightByUserId", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryCustomerSourceDepartmentRightByUserId() throws FLException{
		
		dids = customerSourceRightService.queryCustomerSourceDepartmentRightByUserId(user, queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value="updateCustomerSourceDepartmentRight", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateCustomerSourceDepartmentRight() throws FLException{
		
		customerSourceRightService.updateCustomerSourceDepartmentRight(user, dids, queryCompany());
		
		return SUCCESS;
	}
	
	public List<Integer> getDids() {
		return dids;
	}

	public void setDids(List<Integer> dids) {
		this.dids = dids;
	}

	public UserVO getUser() {
		return user;
	}

	public void setUser(UserVO user) {
		this.user = user;
	}
	
}
