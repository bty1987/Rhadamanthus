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
import com.fanglin.personel.service.SupplierContractServiceService;
import com.fanglin.personel.vo.SupplierContractServiceVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class SupplierContractServiceAction extends BaseListAction {

	private static final long serialVersionUID = 1952453094571421412L;

	@Autowired
	private SupplierContractServiceService supplierContractServiceService;

	private SupplierContractServiceVO supplierContractServiceVO;

	private List<SupplierContractServiceVO> supplierContractServices;

	@Action(value = "querySupplierContractServiceBySid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySupplierContractServiceBySid() {

		supplierContractServices = supplierContractServiceService.querySupplierContractServiceBySid(supplierContractServiceVO);

		return SUCCESS;
	}
	
	@Action(value = "addSupplierContractService", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addSupplierContractService() throws FLException {

		supplierContractServiceService.addSupplierContractService(supplierContractServiceVO);

		return SUCCESS;
	}
	
	@Action(value = "deleteSupplierContractService", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteSupplierContractBrand() throws FLException {

		supplierContractServiceService.deleteSupplierContractService(supplierContractServiceVO);

		return SUCCESS;
	}

	public SupplierContractServiceVO getSupplierContractServiceVO() {
		return supplierContractServiceVO;
	}

	public void setSupplierContractServiceVO(SupplierContractServiceVO supplierContractServiceVO) {
		this.supplierContractServiceVO = supplierContractServiceVO;
	}

	public List<SupplierContractServiceVO> getSupplierContractServices() {
		return supplierContractServices;
	}

	public void setSupplierContractServices(List<SupplierContractServiceVO> supplierContractServices) {
		this.supplierContractServices = supplierContractServices;
	}
}
