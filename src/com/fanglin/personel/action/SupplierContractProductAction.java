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
import com.fanglin.personel.service.SupplierContractProductService;
import com.fanglin.personel.vo.SupplierContractProductVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class SupplierContractProductAction extends BaseListAction {

	private static final long serialVersionUID = -523433534432679509L;

	@Autowired
	private SupplierContractProductService supplierContractProductService;

	private SupplierContractProductVO supplierContractProduct;

	private List<SupplierContractProductVO> supplierContractProducts;

	@Action(value = "querySupplierContractProduct", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySupplierContractProduct() throws FLException {

		supplierContractProducts = supplierContractProductService.querySupplierContractProduct(supplierContractProduct);

		return SUCCESS;
	}

	@Action(value = "addSupplierContractProduct", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addSupplierContractProduct() throws FLException {

		supplierContractProductService.addSupplierContractProduct(supplierContractProducts);

		return SUCCESS;
	}

	@Action(value = "deleteSupplierContractProduct", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteSupplierContractProduct() throws FLException {

		supplierContractProductService.deleteSupplierContractProduct(supplierContractProduct);

		return SUCCESS;
	}

	public SupplierContractProductVO getSupplierContractProduct() {
		return supplierContractProduct;
	}

	public void setSupplierContractProduct(SupplierContractProductVO supplierContractProduct) {
		this.supplierContractProduct = supplierContractProduct;
	}

	public List<SupplierContractProductVO> getSupplierContractProducts() {
		return supplierContractProducts;
	}

	public void setSupplierContractProducts(List<SupplierContractProductVO> supplierContractProducts) {
		this.supplierContractProducts = supplierContractProducts;
	}

}
