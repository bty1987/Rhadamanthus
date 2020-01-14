package com.fanglin.right.action;


import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.right.service.ProductionFunctionRightService;
import com.fanglin.right.vo.ProductionFunctionRightVO;

public class ProductionFunctionRightAction extends BaseListAction {

	private static final long serialVersionUID = 6788183414191506157L;

	@Autowired
	private ProductionFunctionRightService productionFunctionRightService;

	private List<ProductionFunctionRightVO> productionFunctionRights;
	
	private ProductionFunctionRightVO productionFunctionRight;
	
	private List<Long> pfids;
	
	@Action(value="queryProductionFunctionRightByName", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryProductionFunctionRightByName() throws FLException{
		
		productionFunctionRights = productionFunctionRightService.queryProductionFunctionRightByName(productionFunctionRight);
		
		return SUCCESS;
	}
	
	@Action(value="updateProductionFunctionRight", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateProductionFunctionRight() throws FLException{
		
		productionFunctionRightService.updateProductionFunctionRight(productionFunctionRight, pfids, queryCompany());
		
		return SUCCESS;
	}


	public List<ProductionFunctionRightVO> getProductionFunctionRights() {
		return productionFunctionRights;
	}

	public void setProductionFunctionRights(List<ProductionFunctionRightVO> productionFunctionRights) {
		this.productionFunctionRights = productionFunctionRights;
	}

	public ProductionFunctionRightVO getProductionFunctionRight() {
		return productionFunctionRight;
	}

	public void setProductionFunctionRight(ProductionFunctionRightVO productionFunctionRight) {
		this.productionFunctionRight = productionFunctionRight;
	}

	public List<Long> getPfids() {
		return pfids;
	}

	public void setPfids(List<Long> pfids) {
		this.pfids = pfids;
	}
	
}
