package com.fanglin.decoration.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.service.DecorationBalanceService;
import com.fanglin.decoration.vo.DecorationBalanceVO;
import com.fanglin.decoration.vo.DecorationVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class DecorationBalanceAction extends BaseListAction {

	private static final long serialVersionUID = -6260977215065713414L;
	
	@Autowired
	private DecorationBalanceService decorationBalanceService;
	
	private DecorationVO decoration;
	
	private DecorationBalanceVO decorationBalance;
	
	@Action(value = "queryDecorationBalance", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationBalance() throws FLException{
		
		decorationBalance = decorationBalanceService.queryDecorationBalance(decoration);
		
		return SUCCESS;
	}
	
	@Action(value = "makeDecorationBalance", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String makeDecorationBalance() throws FLException{
		
		decorationBalanceService.makeDecorationBalance(decorationBalance, queryUserId());
		
		return SUCCESS;
	}

	public DecorationVO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationVO decoration) {
		this.decoration = decoration;
	}

	public DecorationBalanceVO getDecorationBalance() {
		return decorationBalance;
	}

	public void setDecorationBalance(DecorationBalanceVO decorationBalance) {
		this.decorationBalance = decorationBalance;
	}
	
}
