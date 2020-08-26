package com.fanglin.right.service;

import java.util.List;

import com.fanglin.right.vo.TaskRoleRightVO;

public interface TaskRoleRightService {

	List<TaskRoleRightVO> queryTaskRoleRightByUserId(TaskRoleRightVO taskRoleRightVO);

	public void updateTaskRoleRight(TaskRoleRightVO taskRoleRightVO, List<Long> tids);
}
