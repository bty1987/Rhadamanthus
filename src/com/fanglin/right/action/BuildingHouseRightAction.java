package com.fanglin.right.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.right.service.BuildingHouseRightService;

@ParentPackage("base")
@Namespace("/")
@Controller
public class BuildingHouseRightAction extends BaseListAction {

	private static final long serialVersionUID = -9179677081761019112L;

	@Autowired
	private BuildingHouseRightService buildingHouseRightService;

	private UserBaseVO user;

	private List<Integer> dids;

	private List<String> statuses;

	@Action(value = "queryBuildingHouseDepartmentRightByUserId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryBuildingHouseDepartmentRightByUserId() throws FLException {

		dids = buildingHouseRightService.queryBuildingHouseDepartmentRightByUserId(user, queryCompany());

		return SUCCESS;
	}

	@Action(value = "updateBuildingHouseDepartmentRight", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateBuildingHouseDepartmentRight() throws FLException {

		buildingHouseRightService.updateBuildingHouseDepartmentRight(user, dids, queryCompany());

		return SUCCESS;
	}

	public UserBaseVO getUser() {
		return user;
	}

	public void setUser(UserBaseVO user) {
		this.user = user;
	}

	public List<Integer> getDids() {
		return dids;
	}

	public void setDids(List<Integer> dids) {
		this.dids = dids;
	}

	public List<String> getStatuses() {
		return statuses;
	}

	public void setStatuses(List<String> statuses) {
		this.statuses = statuses;
	}

}
