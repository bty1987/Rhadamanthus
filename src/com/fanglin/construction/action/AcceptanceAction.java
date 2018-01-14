/**
 * @File Name	: AcceptanceAction.java
 * @Package   	: com.fanglin.action.constructionSchedule
 * @Version		: 1.0
 * @Date		: 2014-9-26
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email		: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.construction.service.AcceptanceService;
import com.fanglin.construction.vo.AcceptanceVO;
import com.fanglin.core.action.BaseListAction;

@ParentPackage("base")
@Namespace("/")
@Controller
public class AcceptanceAction extends BaseListAction{

	private static final long serialVersionUID = 369283426907698980L;
	
	@Autowired
	private AcceptanceService acceptanceService;
	
	private AcceptanceVO acceptance;
	
	@Action(value = "queryAcceptance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryAcceptance(){
		
		acceptance = acceptanceService.queryAcceptanceByOrderId(acceptance);
		
		return SUCCESS;
	}
	
	@Action(value = "updateAcceptance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateAcceptance(){
		
		acceptanceService.saveOrUpdateAcceptance(acceptance);
		
		return SUCCESS;
	}

	public AcceptanceVO getAcceptance(){
		return acceptance;
	}

	public void setAcceptance(AcceptanceVO acceptance){
		this.acceptance = acceptance;
	}
	
}