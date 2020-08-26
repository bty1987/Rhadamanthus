package com.fanglin.data.common.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.service.BrandBalanceService;
import com.fanglin.data.common.vo.BrandBalanceVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class BrandBalanceAction extends BaseListAction{

	private static final long serialVersionUID = 7881057103305242351L;
	
	@Autowired
	private BrandBalanceService brandBalanceService;
	
	private List<BrandBalanceVO> brandBalances;
	
	private BrandBalanceVO brandBalance;
	
	@Action(value = "queryBrandBalance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryBrandBalance() throws FLException {

		brandBalances = brandBalanceService.queryBrandBalance(brandBalance);

		return SUCCESS;
	}
	
	@Action(value = "addBrandBalance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addBrandBalance() throws FLException {

		brandBalanceService.addBrandBalance(brandBalance);

		return SUCCESS;
	}
	
	@Action(value = "deleteBrandBalance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteBrandBalance() throws FLException {

		brandBalanceService.deleteBrandBalance(brandBalance);

		return SUCCESS;
	}

	public BrandBalanceService getBrandBalanceService() {
		return brandBalanceService;
	}

	public void setBrandBalanceService(BrandBalanceService brandBalanceService) {
		this.brandBalanceService = brandBalanceService;
	}

	public List<BrandBalanceVO> getBrandBalances() {
		return brandBalances;
	}

	public void setBrandBalances(List<BrandBalanceVO> brandBalances) {
		this.brandBalances = brandBalances;
	}

	public BrandBalanceVO getBrandBalance() {
		return brandBalance;
	}

	public void setBrandBalance(BrandBalanceVO brandBalance) {
		this.brandBalance = brandBalance;
	}
	
}
