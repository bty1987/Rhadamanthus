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
import com.fanglin.personel.service.SupplierContractGoodsService;
import com.fanglin.personel.vo.SupplierContractGoodsVO;
import com.fanglin.utils.SystemConfig;

@ParentPackage("base")
@Namespace("/")
@Controller
public class SupplierContractGoodsAction extends BaseListAction {

	private static final long serialVersionUID = 1L;

	@Autowired
	private SupplierContractGoodsService supplierContractGoodsService;

	private SupplierContractGoodsVO supplierContractGoods;

	private List<SupplierContractGoodsVO> supplierContractGoodes;

	@Action(value = "pageSupplierContractGoods", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageSupplierContractGoods() throws FLException {

		supplierContractGoodsService.pageSupplierContractGoods(getPaging(), getFilters(), queryCompany(), supplierContractGoods);

		return SUCCESS;
	}

	@Action(value = "querySupplierContractGoods", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySupplierContractGoods() throws FLException {

		supplierContractGoodes = supplierContractGoodsService.querySupplierContractGoods(supplierContractGoods);
		return SUCCESS;
	}

	@Action(value = "addSupplierContractGoods", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addSupplierContractGoods() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		supplierContractGoodsService.addSupplierContractGoods(supplierContractGoods, queryCompany());

		return SUCCESS;
	}

	@Action(value = "deleteSupplierContractGoods", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteSupplierContractGoods() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		supplierContractGoodsService.deleteSupplierContractGoods(supplierContractGoods);

		return SUCCESS;
	}

	public SupplierContractGoodsVO getSupplierContractGoods() {
		return supplierContractGoods;
	}

	public void setSupplierContractGoods(SupplierContractGoodsVO supplierContractGoods) {
		this.supplierContractGoods = supplierContractGoods;
	}

	public List<SupplierContractGoodsVO> getSupplierContractGoodes() {
		return supplierContractGoodes;
	}

	public void setSupplierContractGoodes(List<SupplierContractGoodsVO> supplierContractGoodes) {
		this.supplierContractGoodes = supplierContractGoodes;
	}

}
