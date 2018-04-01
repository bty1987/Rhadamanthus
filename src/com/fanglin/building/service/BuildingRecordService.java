package com.fanglin.building.service;

import java.util.List;

import com.fanglin.building.vo.BuildingRecordVO;
import com.fanglin.core.vo.Filter;

public interface BuildingRecordService {
	
	public List<BuildingRecordVO> queryBuildingRecord(List<Filter> filters);
	
	public void addBuildingRecord(BuildingRecordVO buildingRecordVO, String userId);
}
