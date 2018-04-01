package com.fanglin.right.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.right.po.HouseSourceDepartmentRightPO;

public interface HouseSourceRightDao extends Dao<HouseSourceDepartmentRightPO> {
	
	public List<HouseSourceDepartmentRightPO> queryHouseSourceDepartmentRightByUid(int uid, int company);

	public void deleteHouseSourceDepartmentRightByUid(int uid, int company);
	
}
