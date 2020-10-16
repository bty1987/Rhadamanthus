package com.fanglin.data.common.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.TaskDao;
import com.fanglin.data.common.service.TaskService;
import com.fanglin.data.common.vo.TaskVO;
import com.fanglin.data.po.TaskPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("taskService")
@Transactional(readOnly = true)
public class TaskServiceImpl implements TaskService {

	@Autowired
	private TaskDao taskDao;

	public void pageTask(Paging paging, List<Filter> filters) {

		List<TaskPO> taskPOs = taskDao.pageTask(paging, filters);
		List<TaskVO> taskVOs = new ArrayList<TaskVO>();

		for (TaskPO taskPO : taskPOs) {
			TaskVO taskVO = new TaskVO();

			BeanUtil.copyProperties(taskPO, taskVO);

			taskVOs.add(taskVO);
		}
		paging.setData(taskVOs);

	}

	@Override
	public List<TaskVO> queryTask(TaskVO taskVO) {

		List<TaskPO> taskPOs = taskDao.queryTask(taskVO.getLevel());
		List<TaskVO> taskVOs = new ArrayList<TaskVO>();

		for (TaskPO taskPO : taskPOs) {
			taskVO = new TaskVO();

			BeanUtil.copyProperties(taskPO, taskVO);

			taskVOs.add(taskVO);
		}

		return taskVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addTask(TaskVO taskVO) throws FLException {

		TaskPO taskPO = new TaskPO();

		BeanUtil.copyProperties(taskVO, taskPO);

		taskPO.setStatus(TaskPO.STATUS_ENABLE_INT);

		taskDao.save(taskPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateTaskForStatus(TaskVO taskVO) throws FLException {

		TaskPO taskPO = taskDao.get(taskVO.getTid());

		if (taskPO == null) {
			throw new FLException(160027, "任务不存在");
		}

		taskPO.setStatus(taskVO.getStatus());

		taskDao.update(taskPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateTaskForIsShow(TaskVO taskVO) throws FLException {

		TaskPO taskPO = taskDao.get(taskVO.getTid());

		if (taskPO == null) {
			throw new FLException(160027, "任务不存在");
		}

		taskPO.setIsShow(taskVO.getIsShow());

		taskDao.update(taskPO);

		return 0;
	}
}
