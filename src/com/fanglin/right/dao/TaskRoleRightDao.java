package com.fanglin.right.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.right.po.TaskRoleRightPO;

public interface TaskRoleRightDao extends Dao<TaskRoleRightPO> {

	List<TaskRoleRightPO> queryTaskRoleRightByUserId(long rid);

	public void deleteTaskRoleRight(long rid);
}
