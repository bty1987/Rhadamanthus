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
import com.fanglin.data.common.service.BrandProductService;
import com.fanglin.data.common.vo.BrandProductVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class BrandProductAction extends BaseListAction {

	private static final long serialVersionUID = -3711145362740194469L;

	@Autowired
	private BrandProductService brandProductService;

	private List<BrandProductVO> brandProducts;

	private BrandProductVO brandProduct;

	@Action(value = "queryBrandProduct", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryBrandProduct() throws FLException {

		brandProducts = brandProductService.queryBrandProduct(brandProduct);

		return SUCCESS;
	}

	@Action(value = "addBrandProduct", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addBrandProduct() throws FLException {

		brandProductService.addBrandProduct(brandProduct);

		return SUCCESS;
	}

	@Action(value = "updateBrandProduct", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateBrandProduct() throws FLException {

		brandProductService.updateBrandProduct(brandProduct);

		return SUCCESS;
	}

	@Action(value = "deleteBrandProduct", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteBrandProduct() throws FLException {

		brandProductService.deleteBrandProduct(brandProduct);

		return SUCCESS;
	}

	public List<BrandProductVO> getBrandProducts() {
		return brandProducts;
	}

	public void setBrandProducts(List<BrandProductVO> brandProducts) {
		this.brandProducts = brandProducts;
	}

	public BrandProductVO getBrandProduct() {
		return brandProduct;
	}

	public void setBrandProduct(BrandProductVO brandProduct) {
		this.brandProduct = brandProduct;
	}

}
