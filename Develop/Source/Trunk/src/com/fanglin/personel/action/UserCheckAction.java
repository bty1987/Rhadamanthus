/**
 * @File Name		: UserCheckAction.java
 * @Package   	: com.fanglin.personel.action
 * @Version		: 1.0
 * @Date			: 2015-8-13
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
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
import com.fanglin.personel.service.UserCheckService;
import com.fanglin.personel.vo.UserCheckVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class UserCheckAction extends BaseListAction {

	private static final long serialVersionUID = 7699030452526339476L;
	
	@Autowired
	private UserCheckService userCheckService;
	
	private UserCheckVO userCheck;
	
	private List<UserCheckVO> userChecks;
	
	@Action(value = "queryUserCheckByUserIdACheckTimeM", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryUserCheckByUserIdACheckTimeM(){
		
		userChecks = userCheckService.queryUserCheckByUserIdACheckTime(userCheck);
		
		return SUCCESS;
	}
	
	@Action(value = "checkUserCheckM", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String checkUserCheckM() throws FLException{
		
		userCheckService.addUserCheck(userCheck);
		
		return SUCCESS;
	}

	public UserCheckVO getUserCheck() {
		return userCheck;
	}

	public void setUserCheck(UserCheckVO userCheck) {
		this.userCheck = userCheck;
	}

	public List<UserCheckVO> getUserChecks() {
		return userChecks;
	}

	public void setUserChecks(List<UserCheckVO> userChecks) {
		this.userChecks = userChecks;
	}

}
