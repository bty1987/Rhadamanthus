package com.fanglin.building.dao;

import java.util.List;

import com.fanglin.building.po.BuildingSchedulePO;
import com.fanglin.core.dao.Dao;

public interface BuildingScheduleDao extends Dao<BuildingSchedulePO>{

	public List<BuildingSchedulePO> queryBuildingScheduleByBoid(long boid);

	public void resetBuildingSchedule(Long boid, Integer uid);
	
}
