/**
 * @File Name		: DecorationOrderRightAction.java
 * @Package   	: com.fanglin.right.action
 * @Version		: 1.0
 * @Date			: 2016-5-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

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
import com.fanglin.right.service.DecorationOrderRightService;

@ParentPackage("base")
@Namespace("/")
@Controller
public class DecorationOrderRightAction extends BaseListAction {

	private static final long serialVersionUID = -9179677081761019110L;
	
	@Autowired
	private DecorationOrderRightService decorationOrderRightService;
	
	private UserVO user;
	
	private List<Integer> dids;
	
	private List<String> statuses;
	
	@Action(value="queryDecorationOrderDesignDepartmentRightByUserId", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryDecorationOrderDesignDepartmentRightByUserId() throws FLException{
		
		dids = decorationOrderRightService.queryDecorationOrderDesignDepartmentRightByUserId(user, queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value="queryDecorationOrderSalesmanDepartmentRightByUserId", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryDecorationOrderSalesmanDepartmentRightByUserId() throws FLException{
		
		dids = decorationOrderRightService.queryDecorationOrderSalesmanDepartmentRightByUserId(user, queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value="queryDecorationOrderStatusRightByUserId", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryDecorationOrderStatusRightByUserId() throws FLException{
		
		statuses = decorationOrderRightService.queryDecorationOrderStatusRightByUserId(user, queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value="updateDecorationOrderDesignDepartmentRight", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateDecorationOrderDesignDepartmentRight() throws FLException{
		
		decorationOrderRightService.updateDecorationOrderDesignDepartmentRight(user, dids, queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value="updateDecorationOrderSalesmanDepartmentRight", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateDecorationOrderSalesmanDepartmentRight() throws FLException{
		
		decorationOrderRightService.updateDecorationOrderSalesmanDepartmentRight(user, dids, queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value="updateDecorationOrderStatusRight", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateDecorationOrderStatusRight() throws FLException{
		
		decorationOrderRightService.updateDecorationOrderStatusRight(user, statuses, queryCompany());
		
		return SUCCESS;
	}

	public UserVO getUser() {
		return user;
	}

	public void setUser(UserVO user) {
		this.user = user;
	}

	public List<Integer> getDids() {
		return dids;
	}

	public void setDids(List<Integer> dids) {
		this.dids = dids;
	}

	public List<String> getStatuses() {
		return statuses;
	}

	public void setStatuses(List<String> statuses) {
		this.statuses = statuses;
	}

}
