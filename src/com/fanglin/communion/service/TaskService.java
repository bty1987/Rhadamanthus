package com.fanglin.communion.service;

import java.util.List;

import com.fanglin.communion.vo.TaskVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.system.vo.RoleVO;
import com.fanglin.utils.Paging;

public interface TaskService {

	public void pageTask(Paging paging, List<Filter> filters);

	public List<TaskVO> queryTask(TaskVO taskVO);

	public List<TaskVO> queryTaskByRid(RoleVO roleVO, Integer company) throws FLException;

	public List<TaskVO> queryTaskForSelf(String userId, Integer company) throws FLException;

	public int addTask(TaskVO taskVO) throws FLException;

	public int updateTask(TaskVO taskVO) throws FLException;

	public int updateTaskForStatus(TaskVO taskVO) throws FLException;

	public int updateTaskForIsShow(TaskVO taskVO) throws FLException;

	public int updateRoleTask(RoleVO roleVO, TaskVO taskVO, String userId, Integer company) throws FLException;

	public int deleteRoleTask(RoleVO roleVO, TaskVO taskVO, Integer company) throws FLException;

}
