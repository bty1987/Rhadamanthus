package com.fanglin.building.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.building.service.BuildingRecordService;
import com.fanglin.building.vo.BuildingRecordVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class BuildingRecordAction extends BaseListAction{

	private static final long serialVersionUID = 7756852983550376992L;
	
	@Autowired
	private BuildingRecordService buildingRecordService;
	
	private BuildingRecordVO buildingRecord;
	
	private List<BuildingRecordVO> buildingRecords;
	
	@Action(value="pageBuildingRecord", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageBuildingRecord() throws FLException{
		
		buildingRecordService.pageBuildingRecord(getPaging(), getFilters());
		
		return SUCCESS;
		
	}
	
	@Action(value="queryBuildingRecord", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryBuildingRecord() throws FLException{
		
		buildingRecords = buildingRecordService.queryBuildingRecord(buildingRecord);
		
		return SUCCESS;
		
	}

	@Action(value="addBuildingRecord", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String addBuildingRecord() throws FLException{
		
		buildingRecordService.addBuildingRecord(buildingRecord,authentication());
		
		return SUCCESS;
		
	}

	public BuildingRecordVO getBuildingRecord() {
		return buildingRecord;
	}

	public void setBuildingRecord(BuildingRecordVO buildingRecord) {
		this.buildingRecord = buildingRecord;
	}

	public List<BuildingRecordVO> getBuildingRecords() {
		return buildingRecords;
	}

	public void setBuildingRecords(List<BuildingRecordVO> buildingRecords) {
		this.buildingRecords = buildingRecords;
	}

	
}
