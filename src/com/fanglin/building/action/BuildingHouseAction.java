package com.fanglin.building.action;

import java.util.ArrayList;
import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.building.service.BuildingHouseService;
import com.fanglin.building.vo.BuildingHouseVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class BuildingHouseAction extends BaseListAction {

	private static final long serialVersionUID = 369283426907698982L;

	@Autowired
	private BuildingHouseService buildingHouseService;

	private BuildingHouseVO buildingHouse;

	private List<String> autoFillList;

	@Action(value = "pageBuildingHouse", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageBuildingHouse() throws FLException {

		buildingHouseService.pageBuildingHouse(getPaging(), getFilters());

		return SUCCESS;
	}

	@Action(value = "pageBuildingHouseForFollower", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageBuildingHouseForFollower() throws FLException {

		buildingHouseService.pageBuildingHouseForFollower(getPaging(), getFilters(), queryUserId());

		return SUCCESS;
	}

	@Action(value = "pageBuildingHouseForAdvance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageBuildingHouseForAdvance() throws FLException {

		buildingHouseService.pageBuildingHouseForAdvance(getPaging(), getFilters(), queryUserId());

		return SUCCESS;
	}

	@Action(value = "queryBuildingHouseByHsid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryBuildingHouseByHsid() {

		buildingHouse = buildingHouseService.queryBuildingHouseByHsid(buildingHouse);

		return SUCCESS;
	}

	@Action(value = "queryBuildingHouseByNo", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryBuildingHouseByNo() throws FLException {

		buildingHouse = buildingHouseService.queryBuildingHouseByNo(buildingHouse);

		return SUCCESS;
	}

	@Action(value = "checkBuildingHouse", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String checkBuildingHouse() throws FLException {

		buildingHouse = buildingHouseService.checkBuildingHouse(buildingHouse);

		return SUCCESS;
	}

	@Action(value = "addBuildingHouse", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addBuildingHouse() throws FLException {

		buildingHouseService.addBuildingHouse(buildingHouse, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "takeBuildingHouse", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String takeBuildingHouse() throws FLException {

		buildingHouseService.takeBuildingHouse(buildingHouse, queryUserId());

		return SUCCESS;
	}

	@Action(value = "updateBuildingHouse", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateBuildingHouse() throws FLException {

		buildingHouseService.updateBuildingHouse(buildingHouse);

		return SUCCESS;
	}

	@Action(value = "updateBuildingHouseForBelong", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateBuildingHouseForBelong() throws FLException {

		buildingHouseService.updateBuildingHouseForBelong(buildingHouse);

		return SUCCESS;
	}

	@Action(value = "updateBuildingHouseForKeyer", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateBuildingHouseForKeyer() throws FLException {

		buildingHouseService.updateBuildingHouseForKeyer(buildingHouse);

		return SUCCESS;
	}

	@Action(value = "updateBuildingHouseForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateBuildingHouseForStatus() throws FLException {

		buildingHouseService.updateBuildingHouseForStatus(buildingHouse);

		return SUCCESS;
	}

	@Action(value = "updateBuildingHouseForPath", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateBuildingHouseForPath() throws FLException {

		buildingHouseService.updateBuildingHouseForPath(buildingHouse);

		return SUCCESS;
	}

	public BuildingHouseVO getBuildingHouse() {
		return buildingHouse;
	}

	public void setBuildingHouse(BuildingHouseVO buildingHouse) {
		this.buildingHouse = buildingHouse;
	}

	public List<String> getAutoFillList() {
		if (autoFillList == null) {
			autoFillList = new ArrayList<String>();
		}
		return autoFillList;
	}

	public void setAutoFillList(List<String> autoFillList) {
		this.autoFillList = autoFillList;
	}

}