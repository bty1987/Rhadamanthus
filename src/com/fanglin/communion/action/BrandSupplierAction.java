package com.fanglin.communion.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.communion.service.BrandSupplierService;
import com.fanglin.communion.vo.BrandSupplierVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class BrandSupplierAction extends BaseListAction {

	private static final long serialVersionUID = 764496965514491247L;

	@Autowired
	private BrandSupplierService brandSupplierService;

	private BrandSupplierVO brandSupplier;

	private List<BrandSupplierVO> brandSuppliers;

	@Action(value = "queryBrandSupplier", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryBrandSupplier() throws FLException {

		brandSuppliers = brandSupplierService.queryBrandSupplier(brandSupplier);

		return SUCCESS;
	}

	@Action(value = "addBrandSupplier", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addBrandSupplier() throws FLException {

		brandSupplierService.addBrandSupplier(brandSupplier);

		return SUCCESS;
	}

	@Action(value = "deleteBrandSupplier", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteBrandSupplier() throws FLException {

		brandSupplierService.deleteBrandSupplier(brandSupplier);

		return SUCCESS;
	}

	public BrandSupplierVO getBrandSupplier() {
		return brandSupplier;
	}

	public void setBrandSupplier(BrandSupplierVO brandSupplier) {
		this.brandSupplier = brandSupplier;
	}

	public List<BrandSupplierVO> getBrandSuppliers() {
		return brandSuppliers;
	}

	public void setBrandSuppliers(List<BrandSupplierVO> brandSuppliers) {
		this.brandSuppliers = brandSuppliers;
	}

}
