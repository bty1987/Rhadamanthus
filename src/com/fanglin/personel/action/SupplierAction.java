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
import com.fanglin.personel.service.SupplierService;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.utils.SystemConfig;

@ParentPackage("base")
@Namespace("/")
@Controller
public class SupplierAction extends BaseListAction {

	private static final long serialVersionUID = 6243727024524342670L;

	@Autowired
	private SupplierService supplierService;

	private List<UserVO> suppliers;

	private UserVO supplier;

	@Action(value = "pageSupplier", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageSupplier() throws FLException {

		supplierService.pageSupplier(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "querySupplierByPinyin", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySupplierByPinyin() throws FLException {

		suppliers = supplierService.querySupplierByPinyin(supplier.getPinYin(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "addSupplier", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addSupplier() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		supplierService.addSupplier(supplier, queryCompany());

		return SUCCESS;
	}
	
	@Action(value = "updateSupplier", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateSupplier() throws FLException {
		
		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}
		
		supplierService.updateSupplier(supplier);
		
		return SUCCESS;
	}

	public UserVO getSupplier() {
		return supplier;
	}

	public void setSupplier(UserVO supplier) {
		this.supplier = supplier;
	}

	public List<UserVO> getSuppliers() {
		return suppliers;
	}

	public void setSuppliers(List<UserVO> suppliers) {
		this.suppliers = suppliers;
	}

}
