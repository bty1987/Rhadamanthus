/**
 * Title: UserService
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */

package com.fanglin.personel.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.vo.UserInfoVO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.utils.Paging;

public interface UserService {
	
	public void pageUser(Paging paging, List<Filter> filters, UserVO userVO, Integer company) throws FLException;
	
	public UserVO queryUserByLoginId(UserVO userVO) throws FLException;
	
	public UserVO queryUserByUserId(UserVO userVO) throws FLException;
	
	public UserInfoVO queryUserInfoByUserId(UserInfoVO userInfoVO) throws FLException;
	
	public UserInfoVO queryUserForSelfByUserId(UserInfoVO userInfoVO) throws FLException;
	
	public UserVO queryUserByOldUserId(UserVO userVO) throws FLException;
	
	public List<UserVO> queryUserByDetpIdADuty(String deptId, String duty, Integer company) throws FLException;
	
	public List<UserVO> queryUserForNameByPinyinName(String pinyinName,Integer company) throws FLException ;
	
	public List<UserVO> queryUserForNameByDuty(String pinyinName, String duty,Integer  company) throws FLException;
	
	public List<UserVO> queryUserForNameByDutys(String pinyinName, List<String> dutys,Integer  company) throws FLException;
	
	public List<UserVO> queryUserForNameByDutyADept(String pinyinName, String duty, String curUserId,Integer  company) throws FLException ;
	
	public List<UserVO> queryUserForNameByDutysADept(String pinyinName, List<String> dutys, String curUserId,Integer  company)throws FLException ;
	
	public List<UserVO> queryUserForNameByDutysAO(String pinyinName, List<String> dutysA, List<String> dutysO,Integer  company)throws FLException ;
	
	public List<UserVO> queryUserForNameByDutysAODept(String pinyinName, List<String> dutysA, List<String> dutysO, String curUserId,Integer  company)throws FLException ;
	
	public List<UserVO> queryUserForNameByDeptType(String pinyinName, String deptType,Integer company)throws FLException ;
	
	public UserVO validateUser(String loginId, String password) throws FLException;
	
	public int resetPasswords(String UserId,Integer company) throws FLException;
	
	public void addUser(UserInfoVO userInfoVO, int company) throws FLException;
	
	public void updateUser(UserInfoVO userInfoVO, int company) throws FLException;
	
	public void updateUserForBaseInfo(UserInfoVO userInfoVO) throws FLException;
	
	public void updateUserForIsLogin(UserVO userVO) throws FLException;
	
	public void updateUserForAdvance(UserVO userVO) throws FLException;
	
	public void checkUserForPassword(String userId, String password, String rePassword) throws FLException;
	
	
	
}
