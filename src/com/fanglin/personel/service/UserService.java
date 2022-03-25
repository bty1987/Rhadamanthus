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

import com.fanglin.communion.vo.DepartmentTypeVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.personel.vo.UserContractVO;
import com.fanglin.personel.vo.UserEducationVO;
import com.fanglin.personel.vo.UserInfoVO;
import com.fanglin.personel.vo.UserOperationVO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.utils.Paging;

public interface UserService {

	public void pageUser(Paging paging, List<Filter> filters, UserVO userVO, Integer company) throws FLException;
	
	public void pageUserInfo(Paging paging, List<Filter> filters, Integer company) throws FLException;

	public List<UserBaseVO> queryUserByPinyin(String pinyinName, UserVO userVO, DepartmentTypeVO departmentType, int company) throws FLException;

	public List<UserBaseVO> queryUserByUids(List<Integer> uids) throws FLException;

	public UserVO queryUserByLoginId(UserVO userVO) throws FLException;

	public UserVO queryUserByUserId(UserVO userVO) throws FLException;

	public UserInfoVO queryUserInfoByUserId(UserInfoVO userInfoVO) throws FLException;

	public UserInfoVO queryUserForSelfByUserId(UserInfoVO userInfoVO) throws FLException;

	public UserVO queryUserByOldUserId(UserVO userVO) throws FLException;

	public UserVO validateUser(String loginId, String password) throws FLException;

	public void checkUserForPassword(String userId, String password, String rePassword) throws FLException;

	public void addUser(UserInfoVO userInfoVO, List<UserContractVO> userContractVOs, List<UserEducationVO> userEducationVOs, List<UserOperationVO> userOperationVOs, int company) throws FLException;

	public void updateUser(UserInfoVO userInfoVO, int company) throws FLException;

	public void updateUserForBaseInfo(UserInfoVO userInfoVO) throws FLException;

	public void updateUserForIsLogin(UserVO userVO) throws FLException;

	public void updateUserForAdvance(UserVO userVO, int rid) throws FLException;

	public void updateUserForProfile(UserInfoVO userInfoVO) throws FLException;

	public void resetPassword(UserVO userVO, Integer company) throws FLException;

	public void defaultPassword(String userId, int company) throws FLException;

}
