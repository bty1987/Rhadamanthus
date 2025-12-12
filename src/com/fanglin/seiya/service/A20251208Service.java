package com.fanglin.seiya.service;

import com.fanglin.construction.vo.ConstructerVO;
import com.fanglin.construction.vo.ConstructionScheduleVO;
import com.fanglin.construction.vo.ConstructionVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.vo.UserInfoVO;

public interface A20251208Service {

	public void saveOrUpdateUserForPlatforPm(UserInfoVO userInfo, int queryCompany, String queryUserId) throws FLException;

	public int beginConstructionScheduleForPlatforPm(ConstructionScheduleVO constructionScheduleVO, String userId) throws FLException;
	
	public int finishConstructionScheduleForPlatforPm(ConstructionScheduleVO constructionScheduleVO, String userId) throws FLException;

	public void addConstructerForPlatforPm(ConstructerVO constructer, String createrId) throws FLException;

	public void deleteConstructerForPlatforPm(ConstructerVO constructer) throws FLException;

	public int beginConstructionForPlatforPm(ConstructionVO construction, String queryUserId, int queryCompany) throws FLException;
}
