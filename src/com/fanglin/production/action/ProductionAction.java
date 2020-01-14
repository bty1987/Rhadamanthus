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
	
	@Action(value = "updateProduction", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateProduction() throws FLException {
		
		productionService.updateProduction(production);
		
		return SUCCESS;
	}
	
	@Action(value = "updateProductionForAdvance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateProductionForAdvance() throws FLException {
		
		productionService.updateProductionForAdvance(production);
		
		return SUCCESS;
	}
	
	@Action(value = "designProduction", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String designProduction() throws FLException {
		
		productionService.designProduction(production);
		
		return SUCCESS;
	}
	
	@Action(value = "splitProduction", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String splitProduction() throws FLException {
		
		productionService.splitProduction(production);
		
		return SUCCESS;
	}
	
	@Action(value = "instoreProduction", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String instoreProduction() throws FLException {
		
		productionService.instoreProduction(production);
		
		return SUCCESS;
	}
	
	@Action(value = "planProduction", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String planProduction() throws FLException {
		
		productionService.planProduction(production);
		
		return SUCCESS;
	}
	
	@Action(value = "tranProduction", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String tranProduction() throws FLException {
		
		productionService.tranProduction(production);
		
		return SUCCESS;
	}
	
	@Action(value = "mountProduction", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String mountProduction() throws FLException {
		
		productionService.mountProduction(production);
		
		return SUCCESS;
	}
	
	@Action(value = "finishProduction", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String finishProduction() throws FLException {
		
		productionService.finishProduction(production);
		
		return SUCCESS;
	}
	
	@Action(value = "upholdProduction", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String upholdProduction() throws FLException {
		
		productionService.upholdProduction(production);
		
		return SUCCESS;
	}
	
	@Action(value = "terminalProduction", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String terminalProduction() throws FLException {
		
		productionService.terminalProduction(production);
		
		return SUCCESS;
	}
	
	public ProductionVO getProduction() {
		return production;
	}

	public void setProduction(ProductionVO production) {
		this.production = production;
	}
	
}
