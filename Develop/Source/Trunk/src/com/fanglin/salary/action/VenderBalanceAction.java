/**
 * @File Name		: VenderBalanceAction.java
 * @Package   	: com.fanglin.action.salary
 * @Version		: 1.0
 * @Date			: 2014-11-14
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.salary.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.salary.service.VenderBalanceService;

@ParentPackage("base")
@Namespace("/")
@Controller
public class VenderBalanceAction extends BaseListAction{

	private static final long serialVersionUID = 8689633021576628623L;
	
	@Autowired
	private VenderBalanceService venderBalanceService;
	
	@Action(value="pageVenderBalance", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageVenderBalance(){
		
		venderBalanceService.pageVenderBalance(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value="pageVenderBalanceForInit", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageVenderBalanceForInit(){
		
		venderBalanceService.pageVenderBalanceForInit(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value="pageVenderBalanceForPayOff", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageVenderBalanceForPayOff(){
		
		venderBalanceService.pageVenderBalanceForPayOff(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value="payVenderBalance", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String payVenderBalance(){
		
		venderBalanceService.payVenderBalance();
		
		return SUCCESS;
	}
	
}
