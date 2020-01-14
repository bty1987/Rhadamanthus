package com.fanglin.construction.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.construction.service.ConstructionCostService;
import com.fanglin.construction.vo.ConstructionCostVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ConstructionCostAction extends BaseListAction{

	private static final long serialVersionUID = 969283526907678981L;
	
	@Autowired
	private ConstructionCostService constructionCostService;

	private ConstructionCostVO constructionCost;
	
	private List<ConstructionCostVO> constructionCostVOs;


	@Action(value = "pageConstructionCost", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageConstructionCost() throws FLException {
		
		constructionCostService.pageConstructionCost(getPaging(), getFilters(), queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value = "queryConstructionCost", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryConstructionCost() throws FLException {
		
		constructionCostVOs = constructionCostService.queryConstructionCost(queryCompany());

		return SUCCESS;
	}
	
	@Action(value = "addConstructionCost", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addConstructionCost() throws FLException {
		
		constructionCostService.addConstructionCost(constructionCost,queryCompany());

		return SUCCESS;
	}
	
	@Action(value = "updateConstructionCost", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateConstructionCost() throws FLException {
		
		constructionCostService.updateConstructionCost(constructionCost);

		return SUCCESS;
	}

	@Action(value = "updateConstructionCostForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateConstructionCostForStatus() throws FLException {
	
		constructionCostService.updateConstructionCostForStatus(constructionCost);

		return SUCCESS;
	}

	public ConstructionCostVO getConstructionCost() {
		return constructionCost;
	}

	public void setConstructionCost(ConstructionCostVO constructionCost) {
		this.constructionCost = constructionCost;
	}

	public List<ConstructionCostVO> getConstructionCostVOs() {
		return constructionCostVOs;
	}

	public void setConstructionCostVOs(List<ConstructionCostVO> constructionCostVOs) {
		this.constructionCostVOs = constructionCostVOs;
	}
	
}
