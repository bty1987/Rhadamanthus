package com.fanglin.decoration.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.service.DecorationAccountService;
import com.fanglin.decoration.vo.DecorationAccountVO;


@ParentPackage("base")
@Namespace("/")
@Controller
public class DecorationAccountAction extends BaseListAction{

	private static final long serialVersionUID = -8803199049521929598L;

	@Autowired
	private DecorationAccountService decorationAccountService; 
	
	private DecorationAccountVO decorationAccount;
	
	@Action(value = "queryDecorationAccount", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationAccountAction() throws FLException{
		
		decorationAccount = decorationAccountService.queryDecorationAccount(decorationAccount);
		
		return SUCCESS;
	}
	
	@Action(value = "makeDecorationAccount", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String makeDecorationAccountAction() throws  FLException{
		
		decorationAccountService.makeDecorationAccount(decorationAccount, authentication());
		
		return SUCCESS;
	}
	

	public DecorationAccountVO getDecorationAccount() {
		return decorationAccount;
	}

	public void setDecorationAccount(DecorationAccountVO decorationAccount) {
		this.decorationAccount = decorationAccount;
	}
	
	
}
