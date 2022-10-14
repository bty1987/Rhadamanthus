package com.fanglin.balance.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.balance.service.BalanceAccountService;
import com.fanglin.balance.vo.BalanceAccountVO;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class BalanceAccountAction extends BaseListAction {

	private static final long serialVersionUID = -6987407885414378116L;

	@Autowired
	private BalanceAccountService balanceAccountService;

	private List<BalanceAccountVO> balanceAccountes;
	
	private BalanceAccountVO balanceAccount;
	
	@Action(value = "pageBalanceAccount", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageBalanceAccount() throws FLException {
		
		balanceAccountService.pageBalanceAccount(getPaging(), getFilters(), queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "queryBalanceAccount", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryBalanceAccount() {

		balanceAccountes = balanceAccountService.queryBalanceAccount(balanceAccount);

		return SUCCESS;
	}
	
	@Action(value = "queryBalanceAccountForTeller", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	  public String queryBalanceAccountForTeller() throws FLException {
	    
		balanceAccountes = balanceAccountService.queryBalanceAccountForTeller(queryCompany());
	    
	    return SUCCESS;
	  }
		
	@Action(value = "addBalanceAccount", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addBalanceAccount() throws FLException {

		balanceAccountService.addBalanceAccount(balanceAccount, queryUserId(),queryCompany());

		return SUCCESS;
	}
	
	@Action(value = "withdrawBalanceAccount", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	  public String withdrawBalanceAccount() throws FLException {
	    
		balanceAccountService.withdrawBalanceAccount(balanceAccount, queryUserId(), queryCompany());
	    return SUCCESS;
	  }
	
	@Action(value = "updateBalanceAccountForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateBalanceAccountForStatus() throws FLException {
		
		balanceAccountService.updateBalanceAccountForStatus(balanceAccount);
		
		return SUCCESS;
	}

	public List<BalanceAccountVO> getBalanceAccountes() {
		return balanceAccountes;
	}

	public void setBalanceAccountes(List<BalanceAccountVO> balanceAccountes) {
		this.balanceAccountes = balanceAccountes;
	}

	public BalanceAccountVO getBalanceAccount() {
		return balanceAccount;
	}

	public void setBalanceAccount(BalanceAccountVO balanceAccount) {
		this.balanceAccount = balanceAccount;
	}
		

}
