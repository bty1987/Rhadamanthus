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
import com.fanglin.inventory.service.AccessoriesChargeService;
import com.fanglin.inventory.vo.AccessoriesChargeVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class AccessoriesChargeAction extends BaseListAction {

	private static final long serialVersionUID = -7886726770040923160L;

	@Autowired
	private AccessoriesChargeService accessoriesChargeService;

	private AccessoriesChargeVO accessoriesCharge;

	private List<AccessoriesChargeVO> accessoriesCharges;

	@Action(value = "queryAccessoriesCharge", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryAccessoriesCharge() throws FLException {

		accessoriesCharges = accessoriesChargeService.queryAccessoriesCharge(accessoriesCharge);

		return SUCCESS;
	}

	@Action(value = "addAccessoriesCharge", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addAccessoriesCharge() throws FLException {

		accessoriesChargeService.addAccessoriesCharge(accessoriesCharge);

		return SUCCESS;
	}

	@Action(value = "updateAccessoriesCharge", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateAccessoriesCharge() throws FLException {

		accessoriesChargeService.updateAccessoriesCharge(accessoriesCharge);

		return SUCCESS;
	}

	@Action(value = "deleteAccessoriesCharge", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteAccessoriesCharge() throws FLException {

		accessoriesChargeService.deleteAccessoriesCharge(accessoriesCharge);

		return SUCCESS;
	}

	@Action(value = "batchAccessoriesCharge", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String batchAccessoriesCharge() throws FLException {

		accessoriesChargeService.batchAccessoriesCharge(accessoriesCharge, accessoriesCharges);

		return SUCCESS;
	}

	public AccessoriesChargeVO getAccessoriesCharge() {
		return accessoriesCharge;
	}

	public void setAccessoriesCharge(AccessoriesChargeVO accessoriesCharge) {
		this.accessoriesCharge = accessoriesCharge;
	}

	public List<AccessoriesChargeVO> getAccessoriesCharges() {
		return accessoriesCharges;
	}

	public void setAccessoriesCharges(List<AccessoriesChargeVO> accessoriesCharges) {
		this.accessoriesCharges = accessoriesCharges;
	}

}
