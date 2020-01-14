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
public class ProductionPlanAction extends BaseListAction {

	private static final long serialVersionUID = 6604239651370077705L;

	@Autowired
	private ProductionPlanService productionPlanService;
	@Autowired
	private ProductionPlanItemService productionPlanItemService;
	
	private ProductionVO production;

	private ProductionPlanVO productionPlan;
	
	private List<ProductionPlanVO> productionPlans;

	private ProductionPlanItemVO productionPlanItem;

	private List<ProductionPlanItemVO> productionPlanItems;

	@Action(value = "pageProductionPlan", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageProductionPlan() throws FLException {
		
		productionPlanService.pageProductionPlan(getPaging(), getFilters(), queryCompany());
		
		return SUCCESS;
	}

	@Action(value = "pageProductionPlanItemByPpid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageProductionPlanItemByPpid() {
		
		productionPlanItemService.pageProductionPlanItemByPpid(getPaging(), getFilters(), productionPlanItem.getProductionPlan().getPpid());
		
		return SUCCESS;
	}

	@Action(value = "queryProductionPlanByPid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryProductionPlanByPid() {
		
		productionPlans = productionPlanService.queryProductionPlanByPid(productionPlan);
		
		return SUCCESS;
	}

	@Action(value = "addProductionPlan", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addProductionPlan() throws FLException {
		
		productionPlanService.addProductionPlan(productionPlan, queryCompany(), queryUserId());

		return SUCCESS;
	}
	
	@Action(value = "updateProductionPlan", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateProductionPlan() throws FLException {
		
		productionPlanService.updateProductionPlan(productionPlan);
		
		return SUCCESS;
	}
	
	@Action(value = "finishProductionPlan", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String finishProductionPlan() throws FLException {
		
		productionPlanService.finishProductionPlan(productionPlan, queryUserId());
		
		return SUCCESS;
	}

	@Action(value = "addProductionPlanItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addProductionPlanItem() throws FLException {
		
		productionPlanItemService.addProductionPlanItem(productionPlanItem);
		
		return SUCCESS;
	}

	@Action(value = "deleteProductionPlanItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteProductionPlanItem() throws FLException {
		
		productionPlanItemService.deleteProductionPlanItem(productionPlanItem);
		
		return SUCCESS;
	}
	
	public ProductionVO getProduction() {
		return production;
	}

	public void setProduction(ProductionVO production) {
		this.production = production;
	}

	public ProductionPlanVO getProductionPlan() {
		return productionPlan;
	}

	public void setProductionPlan(ProductionPlanVO productionPlan) {
		this.productionPlan = productionPlan;
	}

	public List<ProductionPlanVO> getProductionPlans() {
		return productionPlans;
	}

	public void setProductionPlans(List<ProductionPlanVO> productionPlans) {
		this.productionPlans = productionPlans;
	}

	public ProductionPlanItemVO getProductionPlanItem() {
		return productionPlanItem;
	}

	public void setProductionPlanItem(ProductionPlanItemVO productionPlanItem) {
		this.productionPlanItem = productionPlanItem;
	}
	
	public List<ProductionPlanItemVO> getProductionPlanItems() {
		return productionPlanItems;
	}

	public void setProductionPlanItems(
			List<ProductionPlanItemVO> productionPlanItems) {
		this.productionPlanItems = productionPlanItems;
	}

}
