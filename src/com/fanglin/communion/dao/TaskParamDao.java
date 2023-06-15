package com.fanglin.communion.dao;

import java.util.List;

import com.fanglin.communion.po.TaskParamPO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface TaskParamDao extends Dao<TaskParamPO> {

	public List<TaskParamPO> pageTaskParam(Paging paging, List<Filter> filters);

	public List<TaskParamPO> queryTaskParam(Long tid);

}
