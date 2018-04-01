package com.fanglin.building.dao;

import java.util.List;

import com.fanglin.building.po.BuildingRecordPO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;

public interface BuildingRecordDao extends Dao<BuildingRecordPO>{
	
	public List<BuildingRecordPO> queryBuildingRecord(List<Filter> filters);
}
