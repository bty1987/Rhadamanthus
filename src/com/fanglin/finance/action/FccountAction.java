/**
 * @File Name		: AccountAction.java
 * @Package   	: com.fanglin.finance.action
 * @Version		: 1.0
 * @Date			: 2015-12-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.finance.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.finance.service.FccountService;
import com.fanglin.finance.vo.FccountVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class FccountAction extends BaseListAction {

	private static final long serialVersionUID = -9193429712047744059L;

	@Autowired
	private FccountService accountService;

	private FccountVO account;

	@Action(value = "pageAccount", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) })
	public String pageAccount() {

		accountService.pageAccount(getPaging(), getFilters(), getCondition());

		return SUCCESS;
	}

	@Action(value = "queryAccountByAId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) })
	public String queryAccountByAId() throws FLException {

		account = accountService.queryAccountByAId(account);

		return SUCCESS;
	}

	@Action(value = "queryAccountForFormalByAId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) })
	public String queryAccountForFormalByAId() throws FLException {

		account = accountService.queryAccountForFormalByAId(account);

		return SUCCESS;
	}

	@Action(value = "addAccount", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) })
	public String addAccount() throws FLException {

		accountService.addAccount(account);

		return SUCCESS;
	}

	@Action(value = "updateAccount", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) })
	public String updateAccount() throws FLException {

		accountService.updateAccount(account);

		return SUCCESS;
	}

	@Action(value = "deleteAccount", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) })
	public String deleteAccount() throws FLException {

		accountService.deleteAccount(account);

		return SUCCESS;
	}

	public FccountVO getAccount() {
		return account;
	}

	public void setAccount(FccountVO account) {
		this.account = account;
	}

}
