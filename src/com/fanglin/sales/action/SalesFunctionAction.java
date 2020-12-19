package com.fanglin.sales.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.sales.service.SalesFunctionService;
import com.fanglin.sales.vo.SalesFunctionVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class SalesFunctionAction extends BaseListAction{

	private static final long serialVersionUID = 6008556636575463658L;

	@Autowired
	private SalesFunctionService salesFunctionService;
	
	private List<SalesFunctionVO> salesFunctions;
	
	private SalesFunctionVO salesFunction;
	
	@Action(value = "querySalesFunction", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySalesFunction() throws FLException{
		
		salesFunctions = salesFunctionService.querySalesFunction(salesFunction);
		
		return SUCCESS;
	}
	
	@Action(value = "querySalesFunctionByName", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySalesFunctionByName() throws FLException{
		
		salesFunctions = salesFunctionService.querySalesFunctionByName(salesFunction);
		
		return SUCCESS;
	}
	
	public List<SalesFunctionVO> getSalesFunctions() {
		return salesFunctions;
	}

	public void setSalesFunctions(List<SalesFunctionVO> salesFunctions) {
		this.salesFunctions = salesFunctions;
	}

	public SalesFunctionVO getSalesFunction() {
		return salesFunction;
	}

	public void setSalesFunction(SalesFunctionVO salesFunction) {
		this.salesFunction = salesFunction;
	}



}
