package com.fanglin.inventory.action;


import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;


import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.inventory.service.PurchaseBalanceService;
import com.fanglin.inventory.vo.PurchaseBalanceVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class PurchaseBalanceAction extends BaseListAction{

	private static final long serialVersionUID = 2467748135730987067L;

	@Autowired
	private PurchaseBalanceService purchaseBalanceService;
	
	private List<PurchaseBalanceVO> purchaseBalances;
	
	private PurchaseBalanceVO purchaseBalance;
	
	@Action(value = "queryPurchaseBalanceByPid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryPurchaseBalanceByPid(){
		
		purchaseBalances = purchaseBalanceService.queryPurchaseBalanceByPid(purchaseBalance);
		
		return SUCCESS;
	}
	
	@Action(value = "addPurchaseBalance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addPurchaseBalance() throws FLException{
		
		purchaseBalanceService.addPurchaseBalance(purchaseBalance, queryUserId());
		
		return SUCCESS;
	} 
	
	@Action(value = "updatePurchaseBalance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updatePurchaseBalance() throws FLException{
		
		purchaseBalanceService.updatePurchaseBalance(purchaseBalance);
		
		return SUCCESS;
	} 
	
	@Action(value = "updatePurchaseBalanceForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updatePurchaseBalanceForStatus() throws FLException{
		
		purchaseBalanceService.updatePurchaseBalanceForStatus(purchaseBalance);
		
		return SUCCESS;
	}

	public List<PurchaseBalanceVO> getPurchaseBalances() {
		return purchaseBalances;
	}

	public void setPurchaseBalances(List<PurchaseBalanceVO> purchaseBalances) {
		this.purchaseBalances = purchaseBalances;
	}

	public PurchaseBalanceVO getPurchaseBalance() {
		return purchaseBalance;
	}

	public void setPurchaseBalance(PurchaseBalanceVO purchaseBalance) {
		this.purchaseBalance = purchaseBalance;
	}
	
}
