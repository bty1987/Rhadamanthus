package com.fanglin.right.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.vo.UserBaseVO;

public interface HouseSourceRightService {
	
	public List<Integer> queryHouseSourceDepartmentRightByUserId(UserBaseVO userBaseVO, int company) throws FLException;
	
	public void updateHouseSourceDepartmentRight(UserBaseVO userBaseVO, List<Integer> dids, int company) throws FLException;
	
}
