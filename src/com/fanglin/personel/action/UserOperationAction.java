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
import com.fanglin.personel.service.UserOperationService;
import com.fanglin.personel.vo.UserOperationVO;
import com.fanglin.utils.SystemConfig;

@ParentPackage("base")
@Namespace("/")
@Controller
public class UserOperationAction extends BaseListAction {

	private static final long serialVersionUID = -4949219795091898151L;

	@Autowired
	private UserOperationService userOperationService;
	
	private List<UserOperationVO> userOperations;
	
	private UserOperationVO userOperation;

	@Action(value = "queryUserOperation", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryUserOperation(){
		
		userOperations = userOperationService.queryUserOperation(userOperation);
		
		return SUCCESS;
	}
	
	@Action(value = "addUserOperation", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addUserOperation() throws FLException{
		
		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}
		
		userOperationService.addUserOperation(userOperation);
		
		return SUCCESS;
	}
	
	@Action(value = "updateUserOperation", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateUserOperation() throws FLException{
		
		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}
		
		userOperationService.updateUserOperation(userOperation);
		
		return SUCCESS;
	}
	
	@Action(value = "deleteUserOperation", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteUserOperation() throws FLException{
		
		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}
		
		userOperationService.deleteUserOperation(userOperation);
		
		return SUCCESS;
	}

	public List<UserOperationVO> getUserOperations() {
		return userOperations;
	}

	public void setUserOperations(List<UserOperationVO> userOperations) {
		this.userOperations = userOperations;
	}

	public UserOperationVO getUserOperation() {
		return userOperation;
	}

	public void setUserOperation(UserOperationVO userOperation) {
		this.userOperation = userOperation;
	}
	
}
