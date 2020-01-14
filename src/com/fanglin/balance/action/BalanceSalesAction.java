package com.fanglin.balance.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.balance.service.BalanceSalesService;
import com.fanglin.balance.vo.BalanceSalesVO;
import com.fanglin.balance.vo.BalanceVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.sales.vo.SalesBalanceVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class BalanceSalesAction extends BaseListAction {

	private static final long serialVersionUID = 4861644463792131364L;
	
	@Autowired
	private BalanceSalesService balanceSalesService;
	
	private BalanceSalesVO balanceSales;
	
	private List<BalanceSalesVO> balanceSaless;
	
	private List<SalesBalanceVO> salesBalances;
	
	private List<BalanceVO> balances;
	
	private SalesBalanceVO salesBalance;
	
	@Action(value = "queryBalanceSalesForSales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryBalanceSalesForSales() {

		salesBalances = balanceSalesService.queryBalanceSalesForSales(balanceSales);

		return SUCCESS;
	}
	
	@Action(value = "queryBalanceSalesForBalance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryBalanceSalesForBalance() {

		balances = balanceSalesService.queryBalanceSalesForBalance(balanceSales);

		return SUCCESS;
	}
	
	@Action(value = "submitBalanceSales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String submitBalanceSales() throws FLException {

		balanceSalesService.submitBalanceSales(balanceSaless, queryUserId(), queryCompany());
		return SUCCESS;
	}

	public BalanceSalesService getBalanceSalesService() {
		return balanceSalesService;
	}

	public void setBalanceSalesService(BalanceSalesService balanceSalesService) {
		this.balanceSalesService = balanceSalesService;
	}

	public BalanceSalesVO getBalanceSales() {
		return balanceSales;
	}

	public void setBalanceSales(BalanceSalesVO balanceSales) {
		this.balanceSales = balanceSales;
	}

	public List<BalanceSalesVO> getBalanceSaless() {
		return balanceSaless;
	}

	public void setBalanceSaless(List<BalanceSalesVO> balanceSaless) {
		this.balanceSaless = balanceSaless;
	}

	public List<SalesBalanceVO> getSalesBalances() {
		return salesBalances;
	}

	public void setSalesBalances(List<SalesBalanceVO> salesBalances) {
		this.salesBalances = salesBalances;
	}

	public SalesBalanceVO getSalesBalance() {
		return salesBalance;
	}

	public void setSalesBalance(SalesBalanceVO salesBalance) {
		this.salesBalance = salesBalance;
	}

	public List<BalanceVO> getBalances() {
		return balances;
	}

	public void setBalances(List<BalanceVO> balances) {
		this.balances = balances;
	}
	
	

}
