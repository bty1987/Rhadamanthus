package com.fanglin.building.dao;

import java.util.List;

import com.fanglin.building.po.BuildingSchedulePO;
import com.fanglin.core.dao.Dao;

public interface BuildingScheduleDao extends Dao<BuildingSchedulePO>{

	public List<BuildingSchedulePO> queryBuildingScheduleByBid(Long bid);

	public void resetBuildingSchedule(Long bid, Integer uid);
	
}
