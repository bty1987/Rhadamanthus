package com.fanglin.data.common.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.TaskPO;
import com.fanglin.utils.Paging;

public interface TaskDao extends Dao<TaskPO> {

	public List<TaskPO> pageTask(Paging paging, List<Filter> filters);

	public TaskPO queryTaskByName(String name);

	public List<TaskPO> queryTask(short level);

	public TaskPO queryTaskByKeyWord(String keyWord);

}
