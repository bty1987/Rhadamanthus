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
import com.fanglin.data.common.vo.ContractVO;
import com.fanglin.data.common.vo.SignetVO;
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

	private ContractVO contract;

	private SignetVO signet;

	private String redirect;

	private String data;

	@Action(value = "queryUserContract", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryUserContract() {

		userContracts = userContractService.queryUserContract(userContract);

		return SUCCESS;
	}

	@Action(value = "sendUserContractForAuth", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String sendUserContractForAuth() throws FLException {

		userContractService.sendUserContractForAuth(userContract);

		return SUCCESS;
	}

	@Action(value = "sendUserContract", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String sendUserContract() throws FLException {

		userContractService.sendUserContract(userContract);

		return SUCCESS;
	}

	@Action(value = "redirectUserContract", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String redirectUserContract() throws FLException {

		redirect = userContractService.redirectUserContract(userContract);

		return SUCCESS;
	}

	@Action(value = "viewUserContract", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String viewUserContract() throws FLException {

		redirect = userContractService.viewUserContract(userContract);

		return SUCCESS;
	}

	@Action(value = "signUserContractForCompany", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String signUserContractForCompany() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		redirect = userContractService.signUserContractForCompany(signet, userContract);

		return SUCCESS;
	}

	@Action(value = "signUserContractForUser", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String signUserContractForUser() throws FLException {

		redirect = userContractService.signUserContractForUser(userContract);

		return SUCCESS;
	}

	@Action(value = "addUserContract", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addUserContract() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		userContractService.addUserContract(userContract, contract, data, queryUserId());

		return SUCCESS;
	}

	@Action(value = "affixUserContract", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String affixUserContract() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		userContractService.affixUserContract(userContract);

		return SUCCESS;
	}

	@Action(value = "expireUserContract", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String expireUserContract() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		userContractService.expireUserContract(userContract);

		return SUCCESS;
	}

	@Action(value = "filingUserContract", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String filingUserContract() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		userContractService.filingUserContract(userContract);

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

	@Action(value = "deleteUserContract", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteUserContract() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		userContractService.deleteUserContract(userContract);

		return SUCCESS;
	}

	public List<UserContractVO> getUserContracts() {
		return userContracts;
	}

	public void setUserContracts(List<UserContractVO> userContracts) {
		this.userContracts = userContracts;
	}

	public UserContractVO getUserContract() {
		return userContract;
	}

	public void setUserContract(UserContractVO userContract) {
		this.userContract = userContract;
	}

	public SignetVO getSignet() {
		return signet;
	}

	public void setSignet(SignetVO signet) {
		this.signet = signet;
	}

	public ContractVO getContract() {
		return contract;
	}

	public void setContract(ContractVO contract) {
		this.contract = contract;
	}

	public String getRedirect() {
		return redirect;
	}

	public void setRedirect(String redirect) {
		this.redirect = redirect;
	}

	public String getData() {
		return data;
	}

	public void setData(String data) {
		this.data = data;
	}

}
