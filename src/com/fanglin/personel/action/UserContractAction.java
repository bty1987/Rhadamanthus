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
import com.fanglin.personel.service.UserContractService;
import com.fanglin.personel.vo.UserContractVO;
import com.fanglin.utils.SystemConfig;

@ParentPackage("base")
@Namespace("/")
@Controller
public class UserContractAction extends BaseListAction {

	private static final long serialVersionUID = -5295311320323779589L;

	@Autowired
	private UserContractService userContractService;
	
	private UserContractVO userContract;

	private List<UserContractVO> userContracts;

	private List<String> userContractIds;

	private String editUserId;
	
	@Action(value = "queryUserContract", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryUserContract() {

		userContracts = userContractService.queryUserContract(userContract);

		return SUCCESS;
	}
	
	@Action(value = "addUserContract", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addUserContract() throws FLException {
		
		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}
		
		userContractService.addUserContract(userContract, queryCompany());

		return SUCCESS;
	}
	
	@Action(value = "deleteUserContract", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteUserContract() throws FLException {
		
		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}
		
		userContractService.deleteUserContract(userContract);

		return SUCCESS;
	}
	
	@Action(value = "updateUserContract", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateUserContract() throws FLException {
		
		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}
		
		userContractService.updateUserContract(userContract);

		return SUCCESS;
	}

	public List<UserContractVO> getUserContracts() {
		return userContracts;
	}

	public void setUserContracts(List<UserContractVO> userContracts) {
		this.userContracts = userContracts;
	}

	public List<String> getUserContractIds() {
		return userContractIds;
	}

	public void setUserContractIds(List<String> userContractIds) {
		this.userContractIds = userContractIds;
	}

	public String getEditUserId() {
		return editUserId;
	}

	public void setEditUserId(String editUserId) {
		this.editUserId = editUserId;
	}
	
	public UserContractVO getUserContract() {
		return userContract;
	}

	public void setUserContract(UserContractVO userContract) {
		this.userContract = userContract;
	}

}
