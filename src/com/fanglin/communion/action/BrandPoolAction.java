package com.fanglin.communion.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.communion.service.BrandPoolService;
import com.fanglin.communion.vo.BrandPoolVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class BrandPoolAction extends BaseListAction {

	private static final long serialVersionUID = 2941769173548934851L;

	@Autowired
	private BrandPoolService brandPoolService;

	private BrandPoolVO brandPool;

	private List<BrandPoolVO> brandPools;

	@Action(value = "pageBrandPool", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageBrandPool() throws FLException {

		brandPoolService.pageBrandPool(getPaging(), getFilters());

		return SUCCESS;
	}

	@Action(value = "queryBrandPoolByName", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryBrandPoolByName() throws FLException {

		brandPools = brandPoolService.queryBrandPoolByName(brandPool);

		return SUCCESS;
	}

	@Action(value = "addBrandPool", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addBrandPool() throws FLException {

		brandPoolService.addBrandPool(brandPool, queryCompany());

		return SUCCESS;
	}

	@Action(value = "updateBrandPool", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateBrandPool() throws FLException {

		brandPoolService.updateBrandPool(brandPool);

		return SUCCESS;
	}

	@Action(value = "updateBrandPoolForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateBrandPoolForStatus() throws FLException {

		brandPoolService.updateBrandPoolForStatus(brandPool);

		return SUCCESS;
	}

	public BrandPoolVO getBrandPool() {
		return brandPool;
	}

	public void setBrandPool(BrandPoolVO brandPool) {
		this.brandPool = brandPool;
	}

	public List<BrandPoolVO> getBrandPools() {
		return brandPools;
	}

	public void setBrandPools(List<BrandPoolVO> brandPools) {
		this.brandPools = brandPools;
	}

}
