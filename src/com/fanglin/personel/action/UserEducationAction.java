/**
 * Title: UserContractAction
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */

package com.fanglin.personel.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.service.UserEducationService;
import com.fanglin.personel.vo.UserEducationVO;
import com.fanglin.utils.SystemConfig;

@ParentPackage("base")
@Namespace("/")
@Controller
public class UserEducationAction extends BaseListAction {

	private static final long serialVersionUID = 1886534750449490643L;

	@Autowired
	private UserEducationService userEducationService;
	
	private List<UserEducationVO> userEducations;
	
	private UserEducationVO userEducation;
	
	@Action(value = "queryUserEducation", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryUserEducation(){
		
		userEducations = userEducationService.queryUserEducation(userEducation);
		
		return SUCCESS;
	}
	
	@Action(value = "addUserEducation", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addUserEducation() throws FLException{
		
		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}
		
		userEducationService.addUserEducation(userEducation);
		
		return SUCCESS;
	}
	
	@Action(value = "updateUserEducation", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateUserEducation() throws FLException{
		
		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}
		
		userEducationService.updateUserEducation(userEducation);
		
		return SUCCESS;
	}
	
	@Action(value = "deleteUserEducation", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteUserEducation() throws FLException{
		
		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}
		
		userEducationService.deleteUserEducation(userEducation);
		
		return SUCCESS;
	}

	public List<UserEducationVO> getUserEducations() {
		return userEducations;
	}

	public void setUserEducations(List<UserEducationVO> userEducations) {
		this.userEducations = userEducations;
	}

	public UserEducationVO getUserEducation() {
		return userEducation;
	}

	public void setUserEducation(UserEducationVO userEducation) {
		this.userEducation = userEducation;
	}

}
