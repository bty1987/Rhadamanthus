package com.fanglin.right.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.right.po.TaskRoleRightPO;

public interface TaskRoleRightDao extends Dao<TaskRoleRightPO> {

	public List<TaskRoleRightPO> queryTaskRoleRight(int rid);

	public List<TaskRoleRightPO> queryTaskRoleRight(List<Integer> rids);

	public void deleteTaskRoleRight(int rid);
}
