package com.fanglin.production.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.production.service.ProductionPlanItemService;
import com.fanglin.production.service.ProductionPlanService;
import com.fanglin.production.vo.ProductionPlanItemVO;
import com.fanglin.production.vo.ProductionPlanVO;
import com.fanglin.production.vo.ProductionVO;


@ParentPackage("base")
@Namespace("/")
@Controller
public class ProductionPlanAction extends BaseListAction{

	private static final long serialVersionUID = 6604239651370077705L;
	
	@Autowired
	private ProductionPlanService productionplanservice;
	@Autowired
	private ProductionPlanItemService productionplanitemservice;
	
	private ProductionPlanVO productionPlan;
	
	private ProductionVO production;
	
	private ProductionPlanItemVO productionPlanItem;
	
	private List<ProductionPlanVO> productionplans;
	
	private List<ProductionPlanItemVO> productionplanitems;
	
	@Action(value = "pageProductionPlan", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageProductionPlan(){
		productionplanservice.pageProductionPlan(getPaging(), getFilters(),production.getPid());
		
		return SUCCESS;
	}
	
	@Action(value = "pageProductionPlanItemByPpid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageProductionPlanItemByPpid(){
		productionplanitemservice.pageProductionPlanItemByPpid(getPaging(), getFilters(),productionPlanItem.getProductionPlan().getPpid());
		return SUCCESS;
	}
	
	@Action(value = "queryProductionPlanByPid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryProductionPlanByPid(){
		productionplans = productionplanservice.queryProductionPlanByPid(productionPlan);
		return SUCCESS;
	}
	
	@Action(value = "queryProductionPlanByNo", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryProductionPlanByNo() throws FLException{
		productionPlan = productionplanservice.queryProductionPlanByNo(productionPlan);
		return SUCCESS;
	}
	
	@Action(value = "addProductionPlan", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addProductionPlan() throws FLException{
		productionplanservice.addProductionPlan(productionPlan);
		return SUCCESS;		
	}
	
	@Action(value = "addProductionPlanItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addProductionPlanItem() throws FLException{
		productionplanitemservice.addProductionPlanItem(productionPlanItem);
		return SUCCESS;
	}
	
	@Action(value = "updateProductionPlan", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateProductionPlan() throws FLException{
		productionplanservice.updateProductionPlan(productionPlan);
		return SUCCESS;
	}

	@Action(value = "updateProductionPlanForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateProductionPlanForStatus() throws FLException{
		productionplanservice.updateProductionPlanForStatus(productionPlan);
		return SUCCESS;
	}
	
	@Action(value = "deleteProductionPlanItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
    public String deleteProductionPlanItem() throws FLException{
    	productionplanitemservice.deleteProductionPlanItem(productionPlanItem);
    	return SUCCESS;
    }

	public ProductionPlanVO getProductionPlan() {
		return productionPlan;
	}

	public void setProductionPlan(ProductionPlanVO productionPlan) {
		this.productionPlan = productionPlan;
	}

	public ProductionPlanItemVO getProductionPlanItem() {
		return productionPlanItem;
	}

	public void setProductionPlanItem(ProductionPlanItemVO productionPlanItem) {
		this.productionPlanItem = productionPlanItem;
	}

	public List<ProductionPlanVO> getProductionplans() {
		return productionplans;
	}

	public void setProductionplans(List<ProductionPlanVO> productionplans) {
		this.productionplans = productionplans;
	}

	public List<ProductionPlanItemVO> getProductionplanitems() {
		return productionplanitems;
	}

	public void setProductionplanitems(
			List<ProductionPlanItemVO> productionplanitems) {
		this.productionplanitems = productionplanitems;
	}

	public ProductionVO getProduction() {
		return production;
	}

	public void setProduction(ProductionVO production) {
		this.production = production;
	}

 
	
}
