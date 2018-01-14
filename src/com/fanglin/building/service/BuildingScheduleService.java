package com.fanglin.building.service;

import java.util.List;

import com.fanglin.building.vo.BuildingScheduleVO;
import com.fanglin.building.vo.BuildingVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Authentication;

public interface BuildingScheduleService {

	public List<BuildingScheduleVO> queryBuildingScheduleByBoid(BuildingScheduleVO buildingScheduleVO);
	
	public int nextBuildingSchedule(BuildingScheduleVO buildingScheduleVO, Authentication authentication);
	
	public int updateBuildingSchedule(BuildingScheduleVO buildingScheduleVO);
	
	public int updateBuildingScheduleForStatus(BuildingScheduleVO buildingScheduleVO);
	
	public void resetBuildingSchedule(BuildingVO building, String userId) throws FLException;
}
