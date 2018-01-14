package com.fanglin.building.service;

import java.util.List;

import com.fanglin.building.vo.BuildingScheduleVO;
import com.fanglin.core.vo.Authentication;

public interface BuildingScheduleService {

	public List<BuildingScheduleVO> queryBuildingScheduleByBoid(BuildingScheduleVO buildingScheduleVO);
	
	public int addBuildingSchedule(BuildingScheduleVO buildingScheduleVO, Authentication authentication);
	
	public int updateBuildingSchedule(BuildingScheduleVO buildingScheduleVO);
	
	public int updateBuildingScheduleForStatus(BuildingScheduleVO buildingScheduleVO);
}
