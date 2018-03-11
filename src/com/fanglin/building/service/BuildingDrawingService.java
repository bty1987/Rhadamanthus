package com.fanglin.building.service;

import java.util.List;

import com.fanglin.building.vo.BuildingDrawingVO;

public interface BuildingDrawingService {

	public List<BuildingDrawingVO> queryBuildingDrawing(BuildingDrawingVO buildingDrawingVO);
	
	public void addBuildingDrawing(BuildingDrawingVO buildingDrawingVO, String userId);
	
	public void deleteBuildingDrawing(BuildingDrawingVO buildingDrawingVO);
}
