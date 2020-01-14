package com.fanglin.balance.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;


import com.fanglin.balance.service.BalanceService;
import com.fanglin.balance.vo.AccountVO;
import com.fanglin.balance.vo.BalanceVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class BalanceAction extends BaseListAction{

	private static final long serialVersionUID = 7465909881025416528L;
	
	@Autowired
	private BalanceService balanceService;
	
	private BalanceVO balance;
	
	private List<BalanceVO> balances;
	
	private List<AccountVO> accountes;
	
	@Action(value = "pageBalance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageBalance() throws FLException{
		
		balanceService.pageBalance(getPaging(), getFilters(), queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value = "addBalance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addBalance() throws FLException{
		
		balanceService.addBalance(balance, queryUserId(), queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value = "balanceBalance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String balanceBalance() throws FLException{
		
		balanceService.balanceBalance(balance, accountes, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "payBalance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String payBalance() throws FLException{
		
		balanceService.payBalance(balance, accountes, queryUserId());
		
		return SUCCESS;
	}

	public BalanceVO getBalance() {
		return balance;
	}

	public void setBalance(BalanceVO balance) {
		this.balance = balance;
	}

	public List<BalanceVO> getBalances() {
		return balances;
	}

	public void setBalances(List<BalanceVO> balances) {
		this.balances = balances;
	}

	public List<AccountVO> getAccountes() {
		return accountes;
	}

	public void setAccountes(List<AccountVO> accountes) {
		this.accountes = accountes;
	}
	
	
}
