package com.fanglin.seiya.service;

import java.util.List;

import com.fanglin.construction.vo.AcceptanceVO;
import com.fanglin.construction.vo.ConstructerVO;
import com.fanglin.construction.vo.ConstructionScheduleVO;
import com.fanglin.construction.vo.ConstructionVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.vo.ConstructionNodeVO;
import com.fanglin.personel.vo.UserInfoVO;
import com.fanglin.personel.vo.UserVO;

public interface A20251208Service {

	public void saveOrUpdateUserForPlatforPm(UserInfoVO userInfo, String queryUserId) throws FLException;

	public void addUser(UserInfoVO userInfo, int company, String queryUserId) throws FLException;

	public void updateUser(UserInfoVO userInfo, int company, String queryUserId) throws FLException;

	public void tranUserForPlatforPm(UserVO userVO, String userId) throws FLException;

	public void quitUserForPlatforPm(UserVO userVO, String userId) throws FLException;

	public int beginConstructionScheduleForPlatforPm(ConstructionScheduleVO constructionScheduleVO, String userId) throws FLException;

	public int finishConstructionScheduleForPlatforPm(ConstructionScheduleVO constructionSchedule, String userId) throws FLException;

	public void syncConstructionScheduleForPlatforPm(ConstructionScheduleVO constructionSchedule) throws FLException;

	public void addConstructerForPlatforPm(ConstructerVO constructer, String createrId) throws FLException;

	public void deleteConstructerForPlatforPm(ConstructerVO constructer) throws FLException;

	public void syncSupervisorForPlatforPm(ConstructionVO construction, String userId) throws FLException;

	public int beginConstructionForPlatforPm(ConstructionVO construction, String queryUserId, int queryCompany) throws FLException;

	public void syncConstructionForPlatforPm(ConstructionVO construction) throws FLException;

	public int syncAcceptanceForPlatforPm(AcceptanceVO acceptanceVO) throws FLException;

	public int updateAcceptanceForPlatforPm(AcceptanceVO acceptanceVO) throws FLException;

	public void syncConstructionNodeForPlatforPm(ConstructionNodeVO constructionNodeVO) throws FLException;

	public void syncConstructionNodesForPlatforPm(List<ConstructionNodeVO> constructionNodes) throws FLException;
}
