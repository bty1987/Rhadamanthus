package com.fanglin.balance.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;


import com.fanglin.balance.service.ComcostService;

import com.fanglin.balance.vo.ComcostVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;


@ParentPackage("base")
@Namespace("/")
@Controller
public class ComcostAction extends BaseListAction {

	private static final long serialVersionUID = -7847880157965035826L;
    
	@Autowired
	private ComcostService comcostService;

	private List<ComcostVO> comcosts;
	
	private ComcostVO comcost;
	
	@Action(value = "pageComcost", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageComcost() throws FLException {

		comcostService.pageComcost(getPaging(), getFilters(), queryUserId());

		return SUCCESS;
	}

	@Action(value = "addComcost", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addComcost() throws FLException {

		comcostService.addComcost(comcost, queryUserId(),queryCompany());

		return SUCCESS;
	}
	
	@Action(value = "queryComcost", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	  public String queryComcost() throws FLException {
	    
		comcosts = comcostService.queryComcost(comcost);
	    
	    return SUCCESS;
	  }
	
	
	@Action(value = "updateComcostForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateComcostForStatus() throws FLException {
		
		comcostService.updateComcostForStatus(comcost);
		
		return SUCCESS;
	}
	
	
	public ComcostService getComcostService() {
		return comcostService;
	}

	public void setComcostService(ComcostService comcostService) {
		this.comcostService = comcostService;
	}

	public List<ComcostVO> getComcosts() {
		return comcosts;
	}

	public void setComcosts(List<ComcostVO> comcosts) {
		this.comcosts = comcosts;
	}

	public ComcostVO getComcost() {
		return comcost;
	}


	public void setComcost(ComcostVO comcost) {
		this.comcost = comcost;
	}

	
	
}
