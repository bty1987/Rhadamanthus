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
import com.fanglin.personel.vo.UserVO;
import com.fanglin.utils.Paging;

public interface UserService {
	
	public void pageUser(Paging paging, List<Filter> filters, UserVO userVO, int company) throws FLException;
	
	public void pageUserByNameOPinyinName(Paging paging, UserVO userVO, int company) throws FLException;
	
	public void pageUserForResetPassword(Paging paging, List<Filter> filters, int company) throws FLException;
	
	public UserVO queryUserByLoginId(String loginId);
	
	public UserVO queryUserByUserId(String userId);
	
	public UserVO queryUserByOldUserId(String oldUserId);
	
	public List<UserVO> queryUserByDetpIdADuty(String deptId, String duty);
	
	public List<UserVO> queryUserForNameByPinyinName(String pinyinName);
	
	public List<UserVO> queryUserForNameByDuty(String pinyinName, String duty);
	
	public List<UserVO> queryUserForNameByDutys(String pinyinName, List<String> dutys);
	
	public List<UserVO> queryUserForNameByDutyADept(String pinyinName, String duty, String curUserId);
	
	public List<UserVO> queryUserForNameByDutysADept(String pinyinName, List<String> dutys, String curUserId);
	
	public List<UserVO> queryUserForNameByDutysAO(String pinyinName, List<String> dutysA, List<String> dutysO);
	
	public List<UserVO> queryUserForNameByDutysAODept(String pinyinName, List<String> dutysA, List<String> dutysO, String curUserId);
	
	public UserVO validateUser(String loginId, String password);
	
}
