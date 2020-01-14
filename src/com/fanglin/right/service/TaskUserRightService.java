package com.fanglin.right.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.vo.TaskVO;

import com.fanglin.personel.vo.UserVO;

public interface TaskUserRightService {

	public List<TaskVO> queryTaskUserRightByUserId(UserVO userVO, int company) throws FLException;
	
	public void updateTaskUserRight(List<TaskVO> taskVOs, UserVO userVO, int company) throws FLException;
	
}
