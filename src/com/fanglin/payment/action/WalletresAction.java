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
import com.fanglin.payment.service.WalletresService;
import com.fanglin.payment.vo.WalletresVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class WalletresAction extends BaseListAction {

	private static final long serialVersionUID = -7228042199478089641L;

	@Autowired
	private WalletresService walletresService;
	
	private WalletresVO walletres;
	
	private List<WalletresVO> walletreses;
	
	@Action(value = "queryWalletres", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryWalletres() {
		
		walletreses = walletresService.queryWalletres(walletres);
		
		return SUCCESS;
	}
	
	@Action(value = "uploadWalletres", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String uploadWalletres() throws FLException {
		
		walletresService.uploadWalletres(walletres);
		
		return SUCCESS;
	}
	
	@Action(value = "deleteWalletres", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteWalletres() {
		
		walletresService.deleteWalletres(walletres);
		
		return SUCCESS;
	}

	public WalletresVO getWalletres() {
		return walletres;
	}

	public void setWalletres(WalletresVO walletres) {
		this.walletres = walletres;
	}

	public List<WalletresVO> getWalletreses() {
		return walletreses;
	}

	public void setWalletreses(List<WalletresVO> walletreses) {
		this.walletreses = walletreses;
	}

}
