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
import com.fanglin.production.service.ProductionWorkPlanService;
import com.fanglin.production.vo.ProductionWorkPlanVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ProductionWorkPlanAction extends BaseListAction {

	private static final long serialVersionUID = -8248271434725718610L;

	@Autowired
	private ProductionWorkPlanService productionworkplanservice;

	private ProductionWorkPlanVO productionWorkPlan;

	private List<ProductionWorkPlanVO> productionWorkPlans;

	@Action(value = "queryProductionWorkPlanByPpid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryProductionWorkPlanByPpid() {
		productionWorkPlans = productionworkplanservice.queryProductionWorkPlanByPpid(productionWorkPlan.getPpid());
		return SUCCESS;
	}

	@Action(value = "addProductionWorkPlan", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addProductionWorkPlan() throws FLException {
		productionworkplanservice.addProductionWorkPlan(productionWorkPlan, queryUserId());
		return SUCCESS;
	}

	@Action(value = "deleteProductionWorkPlan", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteProductionWorkPlan() throws FLException {
		productionworkplanservice.deleteProductionWorkPlan(productionWorkPlan);
		return SUCCESS;
	}

	public ProductionWorkPlanVO getProductionWorkPlan() {
		return productionWorkPlan;
	}

	public void setProductionWorkPlan(ProductionWorkPlanVO productionWorkPlan) {
		this.productionWorkPlan = productionWorkPlan;
	}

	public List<ProductionWorkPlanVO> getProductionWorkPlans() {
		return productionWorkPlans;
	}

	public void setProductionWorkPlans(List<ProductionWorkPlanVO> productionWorkPlans) {
		this.productionWorkPlans = productionWorkPlans;
	}

}
