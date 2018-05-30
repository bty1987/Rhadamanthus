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
	
	@Action(value = "pageConstruction", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageConstruction() throws FLException{
		
		constructionService.pageConstruction(getPaging(), getFilters(), queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value = "pageConstructionForSupervision", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageConstructionForSupervision() throws FLException{
		
		constructionService.pageConstructionForSupervision(getPaging(), getFilters(), queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "pageConstructionForAcceptance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageConstructionForAcceptance() throws FLException{
		
		constructionService.pageConstructionForAcceptance(getPaging(), getFilters(), queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value = "queryConstructionByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryConstructionByOrderId() throws FLException{
		
		construction = constructionService.queryConstructionByOrderId(construction);
		
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
