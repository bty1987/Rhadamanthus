package com.fanglin.building.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.building.service.BuildingScheduleService;
import com.fanglin.building.vo.BuildingScheduleVO;
import com.fanglin.building.vo.BuildingVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class BuildingScheduleAction extends BaseListAction {

	private static final long serialVersionUID = -3627477890031406056L;
	
	@Autowired
	private BuildingScheduleService buildingScheduleService;
	
	private BuildingScheduleVO buildingSchedule;
	
	private List<BuildingScheduleVO> buildingSchedules;
	
	private BuildingVO building;
	
	@Action(value="queryBuildingScheduleByBoid", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryBuildingScheduleByBoid() throws FLException{
		
		buildingSchedules = buildingScheduleService.queryBuildingScheduleByBoid(buildingSchedule);
		
		return SUCCESS;
		
	}

	@Action(value="nextBuildingSchedule", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String nextBuildingSchedule() throws FLException{
		
		buildingScheduleService.nextBuildingSchedule(buildingSchedule,authentication());
		
		return SUCCESS;
		
	}
	
	@Action(value="updateBuildingSchedule", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateBuildingSchedule() throws FLException{
		
		buildingScheduleService.updateBuildingSchedule(buildingSchedule);
		
		return SUCCESS;
		
	}
	
	@Action(value="updateBuildingScheduleForStatus", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateBuildingScheduleForStatus() throws FLException{
		
		buildingScheduleService.updateBuildingScheduleForStatus(buildingSchedule);
		
		return SUCCESS;
		
	}
	
	@Action(value = "resetBuildingSchedule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String resetBuildingSchedule() throws FLException{
		
		buildingScheduleService.resetBuildingSchedule(building, queryUserId());
		
		return SUCCESS;
	}

	public BuildingScheduleVO getBuildingSchedule() {
		return buildingSchedule;
	}

	public void setBuildingSchedule(BuildingScheduleVO buildingSchedule) {
		this.buildingSchedule = buildingSchedule;
	}

	public List<BuildingScheduleVO> getBuildingSchedules() {
		return buildingSchedules;
	}

	public void setBuildingSchedules(List<BuildingScheduleVO> buildingSchedules) {
		this.buildingSchedules = buildingSchedules;
	}

	public BuildingVO getBuilding() {
		return building;
	}

	public void setBuilding(BuildingVO building) {
		this.building = building;
	}
	

}
