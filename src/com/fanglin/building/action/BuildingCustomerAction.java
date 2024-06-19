package com.fanglin.building.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.building.service.BuildingCustomerService;
import com.fanglin.building.vo.BuildingCustomerVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class BuildingCustomerAction extends BaseListAction {

	private static final long serialVersionUID = 369283426907698983L;

	@Autowired
	private BuildingCustomerService buildingCustomerService;

	private BuildingCustomerVO buildingCustomer;

	@Action(value = "pageBuildingCustomer", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageBuildingCustomer() throws FLException {

		buildingCustomerService.pageBuildingCustomer(getPaging(), getFilters(), queryUserId());

		return SUCCESS;
	}

	@Action(value = "queryBuildingCustomerByCsid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryBuildingCustomerByCsid() throws FLException {

		buildingCustomer = buildingCustomerService.queryBuildingCustomerByCsid(buildingCustomer);

		return SUCCESS;
	}

	@Action(value = "queryBuildingCustomerByNo", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryBuildingCustomerByNo() throws FLException {

		buildingCustomer = buildingCustomerService.queryBuildingCustomerByNo(buildingCustomer);

		return SUCCESS;
	}

	@Action(value = "checkBuildingCustomer", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String checkBuildingCustomer() throws FLException {

		buildingCustomer = buildingCustomerService.checkBuildingCustomer(buildingCustomer);

		return SUCCESS;
	}

	@Action(value = "addBuildingCustomer", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addBuildingCustomer() throws FLException {

		buildingCustomerService.addBuildingCustomer(buildingCustomer, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "updateBuildingCustomer", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateBuildingCustomer() throws FLException {

		buildingCustomerService.updateBuildingCustomer(buildingCustomer);

		return SUCCESS;
	}

	@Action(value = "updateBuildingCustomerForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateBuildingCustomerForStatus() throws FLException {

		buildingCustomerService.updateBuildingCustomerForStatus(buildingCustomer);

		return SUCCESS;
	}

	public BuildingCustomerVO getBuildingCustomer() {
		return buildingCustomer;
	}

	public void setBuildingCustomer(BuildingCustomerVO buildingCustomer) {
		this.buildingCustomer = buildingCustomer;
	}

}