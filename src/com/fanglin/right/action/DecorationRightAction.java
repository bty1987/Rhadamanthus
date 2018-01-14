/**
 * @File Name		: DecorationRightAction.java
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
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.right.service.DecorationRightService;

@ParentPackage("base")
@Namespace("/")
@Controller
public class DecorationRightAction extends BaseListAction {

	private static final long serialVersionUID = -9179677081761019110L;
	
	@Autowired
	private DecorationRightService decorationRightService;
	
	private UserBaseVO user;
	
	private List<Integer> dids;
	
	private List<String> statuses;
	
	@Action(value="queryDecorationDesignDepartmentRightByUserId", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryDecorationDesignDepartmentRightByUserId() throws FLException{
		
		dids = decorationRightService.queryDecorationDesignDepartmentRightByUserId(user, queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value="queryDecorationSalesmanDepartmentRightByUserId", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryDecorationSalesmanDepartmentRightByUserId() throws FLException{
		
		dids = decorationRightService.queryDecorationSalesmanDepartmentRightByUserId(user, queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value="queryDecorationStatusRightByUserId", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryDecorationStatusRightByUserId() throws FLException{
		
		statuses = decorationRightService.queryDecorationStatusRightByUserId(user, queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value="updateDecorationDesignDepartmentRight", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateDecorationDesignDepartmentRight() throws FLException{
		
		decorationRightService.updateDecorationDesignDepartmentRight(user, dids, queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value="updateDecorationSalesmanDepartmentRight", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateDecorationSalesmanDepartmentRight() throws FLException{
		
		decorationRightService.updateDecorationSalesmanDepartmentRight(user, dids, queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value="updateDecorationStatusRight", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateDecorationStatusRight() throws FLException{
		
		decorationRightService.updateDecorationStatusRight(user, statuses, queryCompany());
		
		return SUCCESS;
	}



	public UserBaseVO getUser() {
		return user;
	}

	public void setUser(UserBaseVO user) {
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
