package com.fanglin.right.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.right.po.BuildingHouseDepartmentRightPO;

public interface BuildingHouseRightDao extends Dao<BuildingHouseDepartmentRightPO> {

	public List<BuildingHouseDepartmentRightPO> queryBuildingHouseDepartmentRightByUid(int uid, int company);

	public void deleteBuildingHouseDepartmentRightByUid(int uid, int company);

}
