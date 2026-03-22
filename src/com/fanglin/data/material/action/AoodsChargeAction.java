package com.fanglin.data.material.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.material.service.AoodsChargeService;
import com.fanglin.data.material.vo.AoodsChargeVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class AoodsChargeAction extends BaseListAction {

	private static final long serialVersionUID = -6253699476990163845L;

	@Autowired
	private AoodsChargeService aoodsChargeService;

	private AoodsChargeVO aoodsCharge;

	private List<AoodsChargeVO> aoodsCharges;

	@Action(value = "pageAoodsCharge", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageAoodsCharge() throws FLException {
		Long aid = aoodsCharge != null && aoodsCharge.getAoods() != null ? aoodsCharge.getAoods().getAid() : null;
		aoodsChargeService.pageAoodsCharge(getPaging(), getFilters(), aid);
		return SUCCESS;
	}

	@Action(value = "queryAoodsChargeByAid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryAoodsChargeByAid() throws FLException {
		aoodsCharges = aoodsChargeService.queryAoodsChargeByAid(aoodsCharge);
		return SUCCESS;
	}

	@Action(value = "addAoodsCharge", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addAoodsCharge() throws FLException {
		aoodsChargeService.addAoodsCharge(aoodsCharge);
		return SUCCESS;
	}

	@Action(value = "updateAoodsCharge", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateAoodsCharge() throws FLException {
		aoodsChargeService.updateAoodsCharge(aoodsCharge);
		return SUCCESS;
	}

	@Action(value = "deleteAoodsCharge", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteAoodsCharge() throws FLException {
		aoodsChargeService.deleteAoodsCharge(aoodsCharge);
		return SUCCESS;
	}

	public AoodsChargeVO getAoodsCharge() {
		return aoodsCharge;
	}

	public void setAoodsCharge(AoodsChargeVO aoodsCharge) {
		this.aoodsCharge = aoodsCharge;
	}

	public List<AoodsChargeVO> getAoodsCharges() {
		return aoodsCharges;
	}

	public void setAoodsCharges(List<AoodsChargeVO> aoodsCharges) {
		this.aoodsCharges = aoodsCharges;
	}

}
