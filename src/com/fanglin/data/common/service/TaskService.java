package com.fanglin.data.common.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.vo.TaskVO;
import com.fanglin.utils.Paging;

public interface TaskService {
	
	public void pageTask(Paging paging, List<Filter> filters);
	
	public List<TaskVO> queryTask();
	
	public int addTask(TaskVO taskVO) throws FLException;
	
	public int updateTaskForStatus(TaskVO taskVO) throws FLException;
	
	public int updateTaskForIsShow(TaskVO taskVO) throws FLException;

}
