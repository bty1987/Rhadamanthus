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
import com.fanglin.payment.service.WalletranService;
import com.fanglin.payment.vo.WalletranVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class WalletranAction extends BaseListAction {

	private static final long serialVersionUID = 6589875803232518334L;

	@Autowired
	private WalletranService walletranService;
	
	private WalletranVO walletran;
	
	private List<WalletranVO> walletrans;
	
	@Action(value = "pageWalletran", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageWalletran() {
		
		walletranService.pageWalletran(getPaging(), getFilters());

		return SUCCESS;
	}
	
	@Action(value = "queryWalletran", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryWalletran() {
		
		walletrans = walletranService.queryWalletran(walletran);
		
		return SUCCESS;
	}

	public WalletranVO getWalletran() {
		return walletran;
	}

	public void setWalletran(WalletranVO walletran) {
		this.walletran = walletran;
	}

	public List<WalletranVO> getWalletrans() {
		return walletrans;
	}

	public void setWalletrans(List<WalletranVO> walletrans) {
		this.walletrans = walletrans;
	}
	
}
