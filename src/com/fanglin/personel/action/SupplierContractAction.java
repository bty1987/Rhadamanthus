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
import com.fanglin.data.common.vo.ContractVO;
import com.fanglin.data.common.vo.SignetVO;
import com.fanglin.data.common.vo.SupplierSignetVO;
import com.fanglin.personel.service.SupplierContractService;
import com.fanglin.personel.vo.SupplierContractVO;
import com.fanglin.utils.SystemConfig;

@ParentPackage("base")
@Namespace("/")
@Controller
public class SupplierContractAction extends BaseListAction {

	private static final long serialVersionUID = 1952453094571421412L;

	@Autowired
	private SupplierContractService supplierContractService;

	private SupplierContractVO supplierContract;

	private List<SupplierContractVO> supplierContracts;

	private SupplierSignetVO supplierSignet;

	private ContractVO contract;

	private SignetVO signet;

	private String redirect;

	private String data;

	private String table;

	@Action(value = "querySupplierContract", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySupplierContract() {

		supplierContracts = supplierContractService.querySupplierContract(supplierContract);

		return SUCCESS;
	}

	@Action(value = "viewSupplierContract", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String viewSupplierContract() throws FLException {

		redirect = supplierContractService.viewSupplierContract(supplierContract);

		return SUCCESS;
	}

	@Action(value = "signSupplierContractForCompany", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String signSupplierContractForCompany() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		redirect = supplierContractService.signSupplierContractForCompany(signet, supplierContract);

		return SUCCESS;
	}

	@Action(value = "signSupplierContractForSupplier", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String signSupplierContractForSupplier() throws FLException {

		redirect = supplierContractService.signSupplierContractForSupplier(supplierSignet, supplierContract);

		return SUCCESS;
	}

	@Action(value = "addSupplierContract", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addSupplierContract() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		supplierContractService.addSupplierContract(supplierContract, contract, queryUserId());

		return SUCCESS;
	}

	@Action(value = "makeSupplierContract", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String makeSupplierContract() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		supplierContractService.makeSupplierContract(supplierContract, data, table);

		return SUCCESS;
	}

	@Action(value = "affixSupplierContract", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String affixSupplierContract() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		supplierContractService.affixSupplierContract(supplierContract, queryUserId());

		return SUCCESS;
	}

	@Action(value = "expireSupplierContract", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String expireSupplierContract() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		supplierContractService.expireSupplierContract(supplierContract);

		return SUCCESS;
	}

	@Action(value = "filingSupplierContract", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String filingSupplierContract() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		supplierContractService.filingSupplierContract(supplierContract);

		return SUCCESS;
	}

	@Action(value = "updateSupplierContract", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateSupplierContract() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		supplierContractService.updateSupplierContract(supplierContract);

		return SUCCESS;
	}

	@Action(value = "deleteSupplierContract", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteSupplierContract() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		supplierContractService.deleteSupplierContract(supplierContract);

		return SUCCESS;
	}

	public SupplierContractVO getSupplierContract() {
		return supplierContract;
	}

	public void setSupplierContract(SupplierContractVO supplierContract) {
		this.supplierContract = supplierContract;
	}

	public List<SupplierContractVO> getSupplierContracts() {
		return supplierContracts;
	}

	public void setSupplierContracts(List<SupplierContractVO> supplierContracts) {
		this.supplierContracts = supplierContracts;
	}

	public ContractVO getContract() {
		return contract;
	}

	public void setContract(ContractVO contract) {
		this.contract = contract;
	}

	public String getRedirect() {
		return redirect;
	}

	public void setRedirect(String redirect) {
		this.redirect = redirect;
	}

	public SupplierSignetVO getSupplierSignet() {
		return supplierSignet;
	}

	public void setSupplierSignet(SupplierSignetVO supplierSignet) {
		this.supplierSignet = supplierSignet;
	}

	public SignetVO getSignet() {
		return signet;
	}

	public void setSignet(SignetVO signet) {
		this.signet = signet;
	}

	public String getData() {
		return data;
	}

	public void setData(String data) {
		this.data = data;
	}

	public String getTable() {
		return table;
	}

	public void setTable(String table) {
		this.table = table;
	}
}
