package com.fanglin.personel.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.personel.vo.UserDepartmentVO;

public interface UserDepartmentService {

	public List<UserDepartmentVO> queryUserDepartment(UserBaseVO user) throws FLException;

	public int updateUserDepartment(UserBaseVO userVO, List<Integer> dids, String userId) throws FLException;

}
