package com.fanglin.building.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Result;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.building.service.BuildingNodeService;
import com.fanglin.building.vo.BuildingNodeVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class BuildingNodeAction extends BaseListAction{

	private static final long serialVersionUID = 6606007839580300364L;

	@Autowired
	private BuildingNodeService buildingNodeService;
	
	private BuildingNodeVO buildingNode;
	
	private List<BuildingNodeVO> buildingNodes;
	
	@Action(value="pageBuildingNode", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageBuildingNode() throws FLException{
		
		buildingNodeService.pageBuildingNode(getPaging(), getFilters());
		
		return SUCCESS;
		
	}
	
	@Action(value="queryBuildingNodeByType", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryBuildingNodeByType() throws FLException{
		
		buildingNode = buildingNodeService.queryBuildingNodeByType(buildingNode);
		
		return SUCCESS;
		
	}
	
	@Action(value="addBuildingNode", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String addBuildingNode() throws FLException{
		
		buildingNodeService.addBuildingNode(buildingNode);
		
		return SUCCESS;
		
	}
	
	@Action(value="updateBuildingNode", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateBuildingNode() throws FLException{
		
		buildingNodeService.updateBuildingNode(buildingNode);
		
		return SUCCESS;
		
	}
	
	@Action(value="updateBuildingNodeForStatus", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateBuildingNodeForStatus() throws FLException{
		
		buildingNodeService.updateBuildingNodeForStatus(buildingNode);
		
		return SUCCESS;
		
	}

	public BuildingNodeVO getBuildingNode() {
		return buildingNode;
	}

	public void setBuildingNode(BuildingNodeVO buildingNode) {
		this.buildingNode = buildingNode;
	}

	public List<BuildingNodeVO> getBuildingNodes() {
		return buildingNodes;
	}

	public void setBuildingNodes(List<BuildingNodeVO> buildingNodes) {
		this.buildingNodes = buildingNodes;
	}

}
