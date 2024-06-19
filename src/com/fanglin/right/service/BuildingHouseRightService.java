package com.fanglin.right.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.vo.UserBaseVO;

public interface BuildingHouseRightService {

	public List<Integer> queryBuildingHouseDepartmentRightByUserId(UserBaseVO userBaseVO, int company) throws FLException;

	public void updateBuildingHouseDepartmentRight(UserBaseVO userBaseVO, List<Integer> dids, int company) throws FLException;

}
