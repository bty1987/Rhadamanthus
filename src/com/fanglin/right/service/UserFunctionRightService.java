package com.fanglin.right.service;

import java.util.List;

import com.fanglin.right.vo.UserFunctionRightVO;

public interface UserFunctionRightService {

	public List<UserFunctionRightVO> queryUserFunctionRight(UserFunctionRightVO userFunctionRight);

	public void updateUserFunctionRight(UserFunctionRightVO userFunctionRight, List<Long> ufids, int company);

}
