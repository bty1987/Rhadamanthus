package com.fanglin.payment.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.payment.service.WalletService;
import com.fanglin.payment.vo.WalletVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class WalletAction extends BaseListAction {
	
	private static final long serialVersionUID = 1204222964721519647L;

	@Autowired
	private WalletService walletService;
	
	private WalletVO wallet;
	
	private WalletVO tallet;
	
	private List<WalletVO> wallets;
	
	@Action(value = "pageWallet", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageWallet() {
		
		walletService.pageWallet(getPaging(), getFilters());

		return SUCCESS;
	}
	
	@Action(value = "queryWallet", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryWallet() {
		
		wallet = walletService.queryWallet(wallet);
		
		return SUCCESS;
	}
	
	@Action(value = "applyWallet", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String applyWallet() throws FLException {
		
		walletService.applyWallet(wallet, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "bindWallet", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String bindWallet() throws FLException {
		 
		wallet = walletService.bindWallet(wallet);
		
		return SUCCESS;
	}
	
	@Action(value = "updateWallet", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateWallet() throws FLException {
		
		wallet = walletService.updateWallet(wallet);
		
		return SUCCESS;
	}
	
	@Action(value = "confirmWallet", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String confirmWallet() throws FLException {
		
		walletService.confirmWallet(wallet);
		
		return SUCCESS;
	}
	
	@Action(value = "freezeWallet", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String freezeWallet() throws FLException {
		
		walletService.freezeWallet(wallet);
		
		return SUCCESS;
	}
	
	@Action(value = "unfreezeWallet", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String unfreezeWallet() throws FLException {
		
		walletService.unfreezeWallet(wallet);
		
		return SUCCESS;
	}
	
	@Action(value = "consumeWallet", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String consumeWallet() throws FLException {
		
		wallet = walletService.consumeWallet(wallet, tallet);
		
		return SUCCESS;
	}
	
	@Action(value = "rechargeWallet", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String rechargeWallet() throws FLException {
		
		wallet = walletService.rechargeWallet(wallet);
		
		return SUCCESS;
	}
	
	@Action(value = "withdrawWallet", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String withdrawWallet() throws FLException {
		
		wallet = walletService.withdrawWallet(wallet);
		
		return SUCCESS;
	}
	
	@Action(value = "consentWallet", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String consentWallet() throws FLException {
		
		walletService.consentWallet(wallet);
		
		return SUCCESS;
	}
	
	@Action(value = "transferWallet", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String transferWallet() throws FLException {
		
		wallet = walletService.transferWallet(wallet, tallet);
		
		return SUCCESS;
	}
	
	@Action(value = "approveWallet", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String approveWallet() throws FLException {
		
		walletService.approveWallet(wallet);
		
		return SUCCESS;
	}

	public WalletVO getWallet() {
		return wallet;
	}

	public void setWallet(WalletVO wallet) {
		this.wallet = wallet;
	}

	public WalletVO getTallet() {
		return tallet;
	}

	public void setTallet(WalletVO tallet) {
		this.tallet = tallet;
	}

	public List<WalletVO> getWallets() {
		return wallets;
	}

	public void setWallets(List<WalletVO> wallets) {
		this.wallets = wallets;
	}

}
