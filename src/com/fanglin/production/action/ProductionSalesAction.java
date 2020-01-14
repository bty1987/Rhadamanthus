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
import com.fanglin.production.service.ProductionSalesService;
import com.fanglin.production.vo.ProductionSalesVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ProductionSalesAction extends BaseListAction{

	private static final long serialVersionUID = -7330301943718278963L;

	@Autowired
	private ProductionSalesService productionsalesService;
	
	private ProductionSalesVO productionSales;
	
	private List<ProductionSalesVO> productionSaless;
	
	@Action(value = "queryProductionSalesByPid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryProductionSalesByPid(){
		 
		productionSaless = productionsalesService.queryProductionSalesByPid(productionSales);
		
		return SUCCESS;
	}
	
	@Action(value = "bindProductionSales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String bindProductionSales() throws FLException{
		
		productionsalesService.bindProductionSales(productionSales);
		
		return SUCCESS;
	}
	
	public List<ProductionSalesVO> getProductionSaless() {
		return productionSaless;
	}

	public void setProductionSaless(List<ProductionSalesVO> productionSaless) {
		this.productionSaless = productionSaless;
	}

	public ProductionSalesVO getProductionSales() {
		return productionSales;
	}

	public void setProductionSales(ProductionSalesVO productionSales) {
		this.productionSales = productionSales;
	}
	
}
