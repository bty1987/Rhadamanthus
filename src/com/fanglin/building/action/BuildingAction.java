package com.fanglin.building.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.building.service.BuildingService;
import com.fanglin.building.vo.BuildingVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class BuildingAction extends BaseListAction{

	private static final long serialVersionUID = 6606007839580300464L;

	@Autowired
	private BuildingService buildingService;
	
	private BuildingVO building;
	
	@Action(value="pageBuilding", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageBuilding() throws FLException{
		
		buildingService.pageBuilding(getPaging(), getFilters());
		
		return SUCCESS;
		
	}
	
	@Action(value="queryBuildingByBid", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryBuildingByBid(){
		
		building = buildingService.queryBuildingByBid(building);
		
		return SUCCESS;
	}
	
	@Action(value="bindBuilding", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String bindBuilding() throws FLException{
		
		buildingService.bindBuilding(building, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "unbindBuilding", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String unbindBuilding() throws FLException{
		
		buildingService.unbindBuilding(building);
		
		return SUCCESS;
	}
	
	@Action(value = "updateBuildingForBalanceStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateBuildingForBalanceStatus() throws FLException{
		
		buildingService.updateBuildingForBalanceStatus(building);
		
		return SUCCESS;
	}

	public BuildingVO getBuilding() {
		return building;
	}

	public void setBuilding(BuildingVO building) {
		this.building = building;
	}
	
}
