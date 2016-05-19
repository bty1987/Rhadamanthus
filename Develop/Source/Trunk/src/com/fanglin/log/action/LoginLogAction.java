/*
 * @File Name	: UserAction.java
 * @Package		：com.fanglin.action 
 * @Version		: 1.0
 * @Date		: 2014-7-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: mzy
 * @Email		: 
 * Describing	: 用户管理相关action
 */

package com.fanglin.log.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.log.service.LoginLogService;

@ParentPackage("base")
@Namespace("/")
@Controller
public class LoginLogAction extends BaseListAction {

	private static final long serialVersionUID = -5295311320323779589L;

	@Autowired
	private LoginLogService loginLogService;
	
	@Action(value = "pageLoginLog", results = { @Result(name = "success", type = "json" , params={"ignoreHierarchy","false"}) }, params = {"contentType", "text/html" } )
	public String pageLoginLog(){
		
		loginLogService.pageLoginLog(getPaging(), getFilters());	
		
		return SUCCESS;
	}

}
