package com.fanglin.data.common.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.data.po.TaskParamPO;

public interface TaskParamDao extends Dao<TaskParamPO> {

	public List<TaskParamPO> queryTaskParam(long tid);
	
}
