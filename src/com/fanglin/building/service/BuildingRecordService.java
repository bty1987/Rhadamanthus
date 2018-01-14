package com.fanglin.building.service;

import java.util.List;

import com.fanglin.building.vo.BuildingRecordVO;
import com.fanglin.core.vo.Authentication;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface BuildingRecordService {

	public void pageBuildingRecord(Paging paging, List<Filter> filters);
	
	public List<BuildingRecordVO> queryBuildingRecord(BuildingRecordVO buildingRecordVO);
	
	public int addBuildingRecord(BuildingRecordVO buildingRecordVO, Authentication authentication);
}
