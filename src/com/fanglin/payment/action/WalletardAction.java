/**
 * Title: PaymentAction
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */

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
import com.fanglin.payment.service.WalletardService;
import com.fanglin.payment.vo.WalletardVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class WalletardAction extends BaseListAction {

	private static final long serialVersionUID = -3152653243244890249L;

	@Autowired
	private WalletardService walletardService;
	
	private WalletardVO walletard;
	
	private List<WalletardVO> walletards;
	
	@Action(value = "queryWalletard", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryWalletard() {
		
		walletards = walletardService.queryWalletard(walletard);
		
		return SUCCESS;
	}
	
	@Action(value = "bindWalletard", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String bindWalletard() throws FLException {
		
		walletard = walletardService.bindWalletard(walletard);
		
		return SUCCESS;
	}
	
	@Action(value = "confirmWalletard", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String confirmWalletard() throws FLException {
		
		walletardService.confirmWalletard(walletard);
		
		return SUCCESS;
	}
	
	@Action(value = "unbindWalletard", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String unbindWalletard() throws FLException {
		
		walletardService.unbindWalletard(walletard);
		
		return SUCCESS;
	}
	
	@Action(value = "deleteWalletard", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteWalletard() throws FLException {
		
		walletardService.deleteWalletard(walletard);
		
		return SUCCESS;
	}

	public WalletardVO getWalletard() {
		return walletard;
	}

	public void setWalletard(WalletardVO walletard) {
		this.walletard = walletard;
	}

	public List<WalletardVO> getWalletards() {
		return walletards;
	}

	public void setWalletards(List<WalletardVO> walletards) {
		this.walletards = walletards;
	}

}
