package com.fanglin.personel.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.personel.vo.UserRoleVO;

public interface UserRoleService {

	public List<UserRoleVO> queryUserRole(UserBaseVO user) throws FLException;

	public int updateUserRole(UserBaseVO userVO, List<Integer> rids, String userId) throws FLException;

}
