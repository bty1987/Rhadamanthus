package com.fanglin.production.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseAction;
import com.fanglin.production.service.ProductionUserWorkFlowService;
import com.fanglin.production.vo.ProductionUserWorkFlowVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ProductionUserWorkFlowAction extends BaseAction{

	private static final long serialVersionUID = -7874328185037942418L;
	
	@Autowired
	private ProductionUserWorkFlowService productionUserWorkFlowService;
	
	private List<ProductionUserWorkFlowVO> ProductionUserWorkFlows;
	
	private ProductionUserWorkFlowVO productionUserWorkFlow;
	
	@Action(value = "queryProductionUserWorkFlowsByPwfids", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryProductionUserWorkFlowByPwfid(){
		ProductionUserWorkFlows = productionUserWorkFlowService.queryProductionUserWorkFlowsByPwfids(ProductionUserWorkFlows);
		return SUCCESS;
	}
 
	public List<ProductionUserWorkFlowVO> getProductionUserWorkFlows() {
		return ProductionUserWorkFlows;
	}

	public void setProductionUserWorkFlows(
			List<ProductionUserWorkFlowVO> productionUserWorkFlows) {
		ProductionUserWorkFlows = productionUserWorkFlows;
	}

	public ProductionUserWorkFlowVO getProductionUserWorkFlow() {
		return productionUserWorkFlow;
	}

	public void setProductionUserWorkFlow(
			ProductionUserWorkFlowVO productionUserWorkFlow) {
		this.productionUserWorkFlow = productionUserWorkFlow;
	}


	
	
 
}
