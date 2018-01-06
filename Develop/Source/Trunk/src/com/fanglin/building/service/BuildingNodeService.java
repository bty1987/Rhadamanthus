package com.fanglin.building.service;

import java.util.List;

import com.fanglin.building.vo.BuildingNodeVO;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface BuildingNodeService {

	public void pageBuildingNode(Paging paging, List<Filter> filters);
	
	public List<BuildingNodeVO> queryBuildingNodeByType(BuildingNodeVO buildingNodeVO);
	
	public int addBuildingNode(BuildingNodeVO buildingNodeVO);
	
	public int updateBuildingNode(BuildingNodeVO buildingNodeVO);
	
	public void updateBuildingNodeForStatus(BuildingNodeVO buildingNodeVO);
}
