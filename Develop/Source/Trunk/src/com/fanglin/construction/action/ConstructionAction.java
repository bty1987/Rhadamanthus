/**
 * @File Name	: ConstructionAction.java
 * @Package   	: com.fanglin.action.construction
 * @Version		: 1.0
 * @Date		: 2014-9-29
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

import com.fanglin.construction.service.ConstructionService;
import com.fanglin.construction.vo.ConstructionVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ConstructionAction extends BaseListAction{

	private static final long serialVersionUID = 3579553772365688946L;
	
	@Autowired
	private ConstructionService constructionService;
	
	private ConstructionVO construction;
	
	@Action(value = "pageDecorationOrderForConstruction", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageDecorationOrderForConstruction() throws FLException{
		
		constructionService.pageDecorationOrderForConstruction(getPaging(), getFilters(), queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value = "pageDecorationOrderForSupervisionByUserId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageDecorationOrderForSupervisionByUserId() throws FLException{
		
		constructionService.pageDecorationOrderForSupervisionByUserId(getPaging(), getFilters(), queryUserId(), queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value = "pageDecorationOrderForAcceptance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageDecorationOrderForAcceptance() throws FLException{
		
		constructionService.pageDecorationOrderForAcceptance(getPaging(), getFilters(), queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value = "queryConstructionByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryConstructionByOrderId() throws FLException{
		
		construction = constructionService.queryConstructionByOrderId(construction, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "queryConstructionForWorkerNameByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryConstructionForWorkerNameByOrderId(){
		
		construction = constructionService.queryConstructionForWorkerNameByOrderId(construction);
		
		return SUCCESS;
	}
	
	@Action(value = "updateConstructionByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateConstructionByOrderId(){
		
		constructionService.saveOrUpdateConstructionByOrderId(construction);
		
		return SUCCESS;
	}

	public ConstructionVO getConstruction() {
		return construction;
	}

	public void setConstruction(ConstructionVO construction) {
		this.construction = construction;
	}

}
