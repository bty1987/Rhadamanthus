package com.fanglin.data.common.service;

import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.vo.TaskParamVO;
import com.fanglin.utils.Paging;

public interface TaskParamService {
	
	public void pageTaskParam(Paging paging, List<Filter> filters);
	
	public List<TaskParamVO> queryTaskParam(TaskParamVO taskParam);
	
	public int addTaskParam(TaskParamVO taskParamVO);
	
	public int updateTaskParam(TaskParamVO taskParamVO);

	public int deleteTaskParam(TaskParamVO taskParamVO);
	
	public int updateTaskParamForStatus(TaskParamVO taskParamVO);
	
}
