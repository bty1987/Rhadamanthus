package com.fanglin.production.action;



import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.production.service.ProductionService;
import com.fanglin.production.vo.ProductionVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ProductionAction extends BaseListAction{

	private static final long serialVersionUID = 5951910885305372612L;
	
	@Autowired
	private ProductionService productionService;
	
	private ProductionVO production; 
	
	
	@Action(value = "pageProduction", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageProduction() throws FLException{
		
		productionService.pageProduction(getPaging(), getFilters(), queryCompany());
		
		return SUCCESS;
	}
	
	
	@Action(value = "addProduction", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addProduction() throws FLException{
		
		productionService.addProduction(production, queryUserId(), queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value = "updateProductionForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateProductionForStatus() throws FLException{
		
		productionService.updateProductionForStatus(production);
		
		return SUCCESS;
	}
	
	@Action(value = "updateProductionForDeliveryStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateProductionForDeliveryStatus() throws FLException{
		
		productionService.updateProductionForDeliveryStatus(production);
		
		return SUCCESS;
	}

	
	public ProductionVO getProduction() {
		return production;
	}

	public void setProduction(ProductionVO production) {
		this.production = production;
	}
	
	

}
