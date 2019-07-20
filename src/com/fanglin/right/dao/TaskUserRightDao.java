package com.fanglin.right.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.right.po.TaskUserRightPO;

public interface TaskUserRightDao extends Dao<TaskUserRightPO> {

	public List<TaskUserRightPO> queryTaskUserRightByUserId(int uid,int company);
	
	public void deleteTaskUserRightByUid(int uid, int company);
	
}
