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
import com.fanglin.personel.service.SupplierContractBrandService;
import com.fanglin.personel.vo.SupplierContractBrandVO;
import com.fanglin.utils.SystemConfig;

@ParentPackage("base")
@Namespace("/")
@Controller
public class SupplierContractBrandAction extends BaseListAction {

	private static final long serialVersionUID = -523433534432679509L;

	@Autowired
	private SupplierContractBrandService supplierBrandService;

	private SupplierContractBrandVO supplierContractBrand;

	private List<SupplierContractBrandVO> supplierContractBrands;

	@Action(value = "pageSupplierContractBrand", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageSupplierBrands() throws FLException {

		supplierBrandService.pageSupplierContractBrand(getPaging(), getFilters(), queryCompany(), supplierContractBrand);

		return SUCCESS;
	}

	@Action(value = "querySupplierContractBrand", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySupplierContractBrand() throws FLException {

		supplierContractBrands = supplierBrandService.querySupplierContractBrand(supplierContractBrand);
		return SUCCESS;
	}

	@Action(value = "addSupplierContractBrand", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addSupplierContractBrand() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		supplierBrandService.addSupplierContractBrand(supplierContractBrand, queryCompany());

		return SUCCESS;
	}

	@Action(value = "deleteSupplierContractBrand", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteSupplierContractBrand() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		supplierBrandService.deleteSupplierContractBrand(supplierContractBrand);

		return SUCCESS;
	}

	public SupplierContractBrandVO getSupplierContractBrand() {
		return supplierContractBrand;
	}

	public void setSupplierContractBrand(SupplierContractBrandVO supplierContractBrand) {
		this.supplierContractBrand = supplierContractBrand;
	}

	public List<SupplierContractBrandVO> getSupplierContractBrands() {
		return supplierContractBrands;
	}

	public void setSupplierContractBrands(List<SupplierContractBrandVO> supplierContractBrands) {
		this.supplierContractBrands = supplierContractBrands;
	}

}
