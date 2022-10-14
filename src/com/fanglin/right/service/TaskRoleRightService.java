package com.fanglin.right.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.right.vo.TaskRoleRightVO;

public interface TaskRoleRightService {

	public List<TaskRoleRightVO> queryTaskRoleRightByRid(TaskRoleRightVO taskRoleRightVO);

	public List<TaskRoleRightVO> queryTaskRoleRightForSelf(String userId) throws FLException;

	public void updateTaskRoleRight(TaskRoleRightVO taskRoleRightVO, List<Long> tids, String userId) throws FLException;
}
