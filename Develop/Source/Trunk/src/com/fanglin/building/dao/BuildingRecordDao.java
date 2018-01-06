package com.fanglin.building.dao;

import java.util.List;

import com.fanglin.building.po.BuildingRecordPO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface BuildingRecordDao extends Dao<BuildingRecordPO>{

	public List<BuildingRecordPO> pageBuildingRecord(Paging paging, List<Filter> filters);
	
	public List<BuildingRecordPO> queryBuildingRecord(Long hsid, Long csid, Short type);
}
