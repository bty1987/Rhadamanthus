package com.fanglin.production.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.production.vo.UserWorkflowVO;

public interface UserWorkflowService {
	
	public List<UserWorkflowVO> queryUserWorkflowByUid(UserWorkflowVO userWorkflowVO) ;
	
	public int updateUserWorkflow(UserWorkflowVO userWorkflowVO, List<Long> wfids) throws FLException;

}
