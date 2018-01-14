package com.fanglin.building.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.building.service.BuildingDrawingService;
import com.fanglin.building.vo.BuildingDrawingVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class BuildingDrawingAction extends BaseListAction{

	private static final long serialVersionUID = -6267513820078770210L;
	
	@Autowired
	private BuildingDrawingService buildingDrawingService;
	
	private BuildingDrawingVO buildingDrawing;
	
	private List<BuildingDrawingVO> buildingDrawings;

	@Action(value="queryBuildingDrawing", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryBuildingDrawing() throws FLException{
		
		buildingDrawings = buildingDrawingService.queryBuildingDrawing(buildingDrawing);
		
		return SUCCESS;
		
	}

	@Action(value="addBuildingDrawing", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String addBuildingDrawing() throws FLException{
		
		buildingDrawingService.addBuildingDrawing(buildingDrawing, authentication());
		
		return SUCCESS;
		
	}

	@Action(value="deleteBuildingDrawing", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String deleteBuildingDrawing() throws FLException{
		
		buildingDrawingService.deleteBuildingDrawing(buildingDrawing);
		
		return SUCCESS;
		
	}

	public BuildingDrawingVO getBuildingDrawing() {
		return buildingDrawing;
	}

	public void setBuildingDrawing(BuildingDrawingVO buildingDrawing) {
		this.buildingDrawing = buildingDrawing;
	}

	public List<BuildingDrawingVO> getBuildingDrawings() {
		return buildingDrawings;
	}

	public void setBuildingDrawings(List<BuildingDrawingVO> buildingDrawings) {
		this.buildingDrawings = buildingDrawings;
	}

}
