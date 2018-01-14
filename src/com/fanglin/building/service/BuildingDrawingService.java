package com.fanglin.building.service;

import java.util.List;

import com.fanglin.building.vo.BuildingDrawingVO;
import com.fanglin.core.vo.Authentication;

public interface BuildingDrawingService {

	public List<BuildingDrawingVO> queryBuildingDrawing(BuildingDrawingVO buildingDrawingVO);
	
	public int addBuildingDrawing(BuildingDrawingVO buildingDrawingVO, Authentication authentication);
	
	public int deleteBuildingDrawing(BuildingDrawingVO buildingDrawingVO);
}
