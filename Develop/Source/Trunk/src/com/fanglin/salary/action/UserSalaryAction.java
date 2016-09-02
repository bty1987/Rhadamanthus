/**
 * Title: UserSalaryAction
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */

package com.fanglin.salary.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.salary.service.UserSalaryService;
import com.fanglin.salary.vo.UserSalaryVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class UserSalaryAction extends BaseListAction {

	private static final long serialVersionUID = -5295311320323779589L;

	@Autowired
	private UserSalaryService userSalaryService;
	
	private UserSalaryVO userSalary;

	private List<Long> autoIds;
	
	@Action(value = "pageUserSalary", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageUserSalary() throws FLException{
		
		userSalaryService.pageUserSalary(getPaging(),getFilters());
		
		return SUCCESS;
	}
	
	@Action(value = "pageUserSalaryByUserId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageUserSalaryByUserId() throws FLException{
		
		userSalaryService.pageUserSalaryByUserId(getPaging(), userSalary);
		
		return SUCCESS;
	}
	
	@Action(value = "addUserSalary", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addUserSalary() throws FLException{
		
		userSalary.setCreateUserId(queryUserId());
		
		userSalaryService.saveUserSalary(userSalary);
		
		return SUCCESS;
	}

	@Action(value = "updateUserSalary", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateUserSalary() throws FLException{
		
		userSalary.setCreateUserId(queryUserId());
		
		userSalaryService.updateUserSalary(userSalary);
		
		return SUCCESS;
	}

	@Action(value = "deleteUserSalary", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteUserSalary() throws FLException{
		
		userSalaryService.deleteUserSalary(autoIds);
		
		return SUCCESS;
	}

	public void setAutoIds(List<Long> autoIds){
		this.autoIds = autoIds;
	}

	public List<Long> getAutoIds(){
		return autoIds;
	}
	
	public UserSalaryVO getUserSalary(){
		return userSalary;
	}

	public void setUserSalary(UserSalaryVO userSalary){
		this.userSalary = userSalary;
	}

}
