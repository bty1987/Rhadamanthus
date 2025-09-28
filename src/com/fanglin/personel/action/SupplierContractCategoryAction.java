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
import com.fanglin.personel.service.SupplierContractCategoryService;
import com.fanglin.personel.vo.SupplierContractCategoryVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class SupplierContractCategoryAction extends BaseListAction {

	private static final long serialVersionUID = -523433534432679509L;

	@Autowired
	private SupplierContractCategoryService supplierContractCategoryService;

	private SupplierContractCategoryVO supplierContractCategory;

	private List<SupplierContractCategoryVO> supplierContractCategorys;

	@Action(value = "querySupplierContractCategory", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySupplierContractCategory() throws FLException {

		supplierContractCategorys = supplierContractCategoryService.querySupplierContractCategory(supplierContractCategory);
		return SUCCESS;
	}

	@Action(value = "addSupplierContractCategory", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addSupplierContractCategory() throws FLException {

		supplierContractCategoryService.addSupplierContractCategory(supplierContractCategory);

		return SUCCESS;
	}

	@Action(value = "deleteSupplierContractCategory", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteSupplierContractCategory() throws FLException {

		supplierContractCategoryService.deleteSupplierContractCategory(supplierContractCategory);

		return SUCCESS;
	}

	public SupplierContractCategoryVO getSupplierContractCategory() {
		return supplierContractCategory;
	}

	public void setSupplierContractCategory(SupplierContractCategoryVO supplierContractCategory) {
		this.supplierContractCategory = supplierContractCategory;
	}

	public List<SupplierContractCategoryVO> getSupplierContractCategorys() {
		return supplierContractCategorys;
	}

	public void setSupplierContractCategorys(List<SupplierContractCategoryVO> supplierContractCategorys) {
		this.supplierContractCategorys = supplierContractCategorys;
	}

}
