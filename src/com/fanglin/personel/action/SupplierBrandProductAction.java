package com.fanglin.personel.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.service.SupplierBrandProductService;
import com.fanglin.personel.vo.SupplierBrandProductVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class SupplierBrandProductAction extends BaseListAction {

	private static final long serialVersionUID = -523433534432679509L;

	@Autowired
	private SupplierBrandProductService supplierBrandProductService;

	private SupplierBrandProductVO supplierBrandProduct;

	private List<SupplierBrandProductVO> supplierBrandProducts;

	@Action(value = "querySupplierBrandProduct", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySupplierBrandProduct() throws FLException {

		supplierBrandProducts = supplierBrandProductService.querySupplierBrandProduct(supplierBrandProduct);
		return SUCCESS;
	}

	@Action(value = "addSupplierBrandProduct", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addSupplierBrandProduct() throws FLException {

		supplierBrandProductService.addSupplierBrandProduct(supplierBrandProduct);

		return SUCCESS;
	}

	@Action(value = "deleteSupplierBrandProduct", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteSupplierBrandProduct() throws FLException {

		supplierBrandProductService.deleteSupplierBrandProduct(supplierBrandProduct);

		return SUCCESS;
	}
	
//	@Action(value = "updateSupplierBrandProduct", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
//	public String updateSupplierBrandProduct() throws FLException {
//
//		if (SystemConfig.getString("communion") == null) {
//			throw new FLException(-1, "无操作权限");
//		}
//
//		supplierBrandProductService.updateSupplierBrandProduct(SupplierBrandProduct);
//
//		return SUCCESS; 
//	}

	public SupplierBrandProductVO getSupplierBrandProduct() {
		return supplierBrandProduct;
	}

	public void setSupplierBrandProduct(SupplierBrandProductVO supplierBrandProduct) {
		this.supplierBrandProduct = supplierBrandProduct;
	}

	public List<SupplierBrandProductVO> getSupplierBrandProducts() {
		return supplierBrandProducts;
	}

	public void setSupplierBrandProducts(List<SupplierBrandProductVO> supplierBrandProducts) {
		this.supplierBrandProducts = supplierBrandProducts;
	}

}
