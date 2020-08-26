package com.fanglin.data.common.service;

import java.util.List;

import com.fanglin.data.common.vo.TaskParamVO;
import com.fanglin.data.common.vo.TaskVO;

public interface TaskParamService {
	
	public List<TaskParamVO> queryTaskParam(TaskVO taskVO);
	
	public int addTaskParam(TaskParamVO taskParamVO);
	
	public int updateTaskParam(TaskParamVO taskParamVO);
	
	public int updateTaskParamForStatus(TaskParamVO taskParamVO);
	
	public int deleteTaskParam(TaskParamVO taskParamVO);
	
}
