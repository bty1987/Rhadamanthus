package com.fanglin.balance.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.balance.service.AccountService;
import com.fanglin.balance.vo.AccountVO;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class AccountAction extends BaseListAction {

	private static final long serialVersionUID = -6987407885414378116L;

	@Autowired
	private AccountService accountService;

	private List<AccountVO> accountes;
	
	private AccountVO account;
	
	@Action(value = "pageAccount", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageAccount() throws FLException {
		
		accountService.pageAccount(getPaging(), getFilters(), queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "queryAccount", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryAccount() {

		accountes = accountService.queryAccount(account);

		return SUCCESS;
	}
	
	@Action(value = "queryAccountForTeller", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	  public String queryAccountForTeller() throws FLException {
	    
		accountes = accountService.queryAccountForTeller(queryCompany());
	    
	    return SUCCESS;
	  }
		
	@Action(value = "addAccount", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addAccount() throws FLException {

		accountService.addAccount(account, queryUserId(),queryCompany());

		return SUCCESS;
	}
	
	@Action(value = "withdrawAccount", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	  public String withdrawAccount() throws FLException {
	    
	    accountService.withdrawAccount(account, queryUserId(), queryCompany());
	    return SUCCESS;
	  }
	
	@Action(value = "updateAccountForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateAccountForStatus() throws FLException {
		
		accountService.updateAccountForStatus(account);
		
		return SUCCESS;
	}
		
	public List<AccountVO> getAccountes() {
		return accountes;
	}

	public void setAccountes(List<AccountVO> accountes) {
		this.accountes = accountes;
	}

	public AccountVO getAccount() {
		return account;
	}

	public void setAccount(AccountVO account) {
		this.account = account;
	}

}
