package com.fanglin.production.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.production.service.ProductionFunctionService;
import com.fanglin.production.vo.ProductionFunctionVO;

@ParentPackage("base")
@Namespace("/")
public class ProductionFunctionAction extends BaseListAction {

	private static final long serialVersionUID = 1L;

	@Autowired
	private ProductionFunctionService productionFunctionService;
	
	private List<ProductionFunctionVO> productionFunctions;
	
	private ProductionFunctionVO productionFunction;

	@Action(value = "queryProductionFunction", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryProductionFunction() throws FLException{
		
		productionFunctions = productionFunctionService.queryProductionFunction(productionFunction);
		
		return SUCCESS;
	}
	
	@Action(value = "queryProductionFunctionByName", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryProductionFunctionByName() throws FLException{
		
		productionFunctions = productionFunctionService.queryProductionFunctionByName(productionFunction);
		
		return SUCCESS;
	}

	public List<ProductionFunctionVO> getProductionFunctions() {
		return productionFunctions;
	}

	public void setProductionFunctions(
			List<ProductionFunctionVO> productionFunctions) {
		this.productionFunctions = productionFunctions;
	}

	public ProductionFunctionVO getProductionFunction() {
		return productionFunction;
	}

	public void setProductionFunction(ProductionFunctionVO productionFunction) {
		this.productionFunction = productionFunction;
	}
	
}
