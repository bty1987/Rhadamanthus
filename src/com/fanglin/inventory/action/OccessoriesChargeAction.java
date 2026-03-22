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
import com.fanglin.inventory.service.OccessoriesChargeService;
import com.fanglin.inventory.vo.OccessoriesChargeVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class OccessoriesChargeAction extends BaseListAction {

	private static final long serialVersionUID = -7886726770040923157L;

	@Autowired
	private OccessoriesChargeService occessoriesChargeService;

	private OccessoriesChargeVO occessoriesCharge;

	private List<OccessoriesChargeVO> occessoriesCharges;

	@Action(value = "queryOccessoriesCharge", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryOccessoriesCharge() throws FLException {

		occessoriesCharges = occessoriesChargeService.queryOccessoriesCharge(occessoriesCharge);

		return SUCCESS;
	}

	@Action(value = "addOccessoriesCharge", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addOccessoriesCharge() throws FLException {

		occessoriesChargeService.addOccessoriesCharge(occessoriesCharge);

		return SUCCESS;
	}

	@Action(value = "updateOccessoriesCharge", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateOccessoriesCharge() throws FLException {

		occessoriesChargeService.updateOccessoriesCharge(occessoriesCharge);

		return SUCCESS;
	}

	@Action(value = "deleteOccessoriesCharge", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteOccessoriesCharge() throws FLException {

		occessoriesChargeService.deleteOccessoriesCharge(occessoriesCharge);

		return SUCCESS;
	}

	@Action(value = "batchOccessoriesCharge", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String batchOccessoriesCharge() throws FLException {

		occessoriesChargeService.batchOccessoriesCharge(occessoriesCharge, occessoriesCharges);

		return SUCCESS;
	}

	public OccessoriesChargeVO getOccessoriesCharge() {
		return occessoriesCharge;
	}

	public void setOccessoriesCharge(OccessoriesChargeVO occessoriesCharge) {
		this.occessoriesCharge = occessoriesCharge;
	}

	public List<OccessoriesChargeVO> getOccessoriesCharges() {
		return occessoriesCharges;
	}

	public void setOccessoriesCharges(List<OccessoriesChargeVO> occessoriesCharges) {
		this.occessoriesCharges = occessoriesCharges;
	}

}
