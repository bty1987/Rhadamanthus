package com.fanglin.inventory.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.inventory.service.SupplierService;
import com.fanglin.inventory.vo.SupplierVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class SupplierAction extends BaseListAction{

	private static final long serialVersionUID = -4071035101708329532L;
	
	@Autowired
	private SupplierService supplierService;
	
	private List<SupplierVO> suppliers;
	
	private SupplierVO supplier;

	@Action(value = "querySupplierByGid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySupplierByGid(){
		suppliers = supplierService.querySupplierByGid(supplier);
		return SUCCESS;
	}
	
	@Action(value = "querySupplierForEnableByGid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySupplierForEnableByGid(){
		suppliers = supplierService.querySupplierForEnableByGid(supplier);
		return SUCCESS;
	}
	
	@Action(value = "addSupplier", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addSupplier() throws FLException{
		supplierService.addSupplier(supplier);
		return SUCCESS;
	}
	
	@Action(value = "updateSupplierForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateSupplierForStatus() throws FLException{
		supplierService.updateSupplierForStatus(supplier);
		return SUCCESS;
	}

	public List<SupplierVO> getSuppliers() {
		return suppliers;
	}

	public void setSuppliers(List<SupplierVO> suppliers) {
		this.suppliers = suppliers;
	}

	public SupplierVO getSupplier() {
		return supplier;
	}

	public void setSupplier(SupplierVO supplier) {
		this.supplier = supplier;
	}	
}
