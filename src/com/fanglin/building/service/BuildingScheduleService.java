package com.fanglin.building.service;

import java.util.List;

import com.fanglin.building.vo.BuildingScheduleVO;
import com.fanglin.building.vo.BuildingVO;
import com.fanglin.core.interceptor.FLException;

public interface BuildingScheduleService {

	public List<BuildingScheduleVO> queryBuildingScheduleByBoid(BuildingScheduleVO buildingScheduleVO);
	
	public BuildingScheduleVO nextBuildingSchedule(BuildingScheduleVO buildingScheduleVO, String userId);
	
	public BuildingScheduleVO updateBuildingSchedule(BuildingScheduleVO buildingScheduleVO);
	
	public BuildingScheduleVO updateBuildingScheduleForStatus(BuildingScheduleVO buildingScheduleVO);
	
	public void resetBuildingSchedule(BuildingVO building, String userId) throws FLException;
}
