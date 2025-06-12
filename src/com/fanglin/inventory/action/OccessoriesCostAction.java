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
import com.fanglin.inventory.service.OccessoriesCostService;
import com.fanglin.inventory.vo.OccessoriesCostVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class OccessoriesCostAction extends BaseListAction {

	private static final long serialVersionUID = -7886726770040923156L;

	@Autowired
	private OccessoriesCostService occessoriesCostService;

	private OccessoriesCostVO occessoriesCost;

	private List<OccessoriesCostVO> occessoriesCosts;

	@Action(value = "queryOccessoriesCost", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryOccessoriesCost() throws FLException {

		occessoriesCosts = occessoriesCostService.queryOccessoriesCost(occessoriesCost);

		return SUCCESS;
	}

	@Action(value = "addOccessoriesCost", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addOccessoriesCost() throws FLException {

		occessoriesCostService.addOccessoriesCost(occessoriesCost);

		return SUCCESS;
	}

	@Action(value = "updateOccessoriesCost", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateOccessoriesCost() throws FLException {

		occessoriesCostService.updateOccessoriesCost(occessoriesCost);

		return SUCCESS;
	}

	@Action(value = "deleteOccessoriesCost", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteOccessoriesCost() throws FLException {

		occessoriesCostService.deleteOccessoriesCost(occessoriesCost);

		return SUCCESS;
	}

	public OccessoriesCostVO getOccessoriesCost() {
		return occessoriesCost;
	}

	public void setOccessoriesCost(OccessoriesCostVO occessoriesCost) {
		this.occessoriesCost = occessoriesCost;
	}

	public List<OccessoriesCostVO> getOccessoriesCosts() {
		return occessoriesCosts;
	}

	public void setOccessoriesCosts(List<OccessoriesCostVO> occessoriesCosts) {
		this.occessoriesCosts = occessoriesCosts;
	}

}
