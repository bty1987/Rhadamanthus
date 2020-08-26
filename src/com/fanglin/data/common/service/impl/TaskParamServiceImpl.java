package com.fanglin.data.common.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.data.common.dao.TaskParamDao;
import com.fanglin.data.common.service.TaskParamService;
import com.fanglin.data.common.vo.TaskParamVO;
import com.fanglin.data.common.vo.TaskVO;
import com.fanglin.data.po.TaskParamPO;
import com.fanglin.utils.BeanUtil;

@Service("taskParamDaoService")
@Transactional(readOnly = true)
public class TaskParamServiceImpl implements TaskParamService {
	
	@Autowired
	private TaskParamDao taskParamDao;

	@Override
	public List<TaskParamVO> queryTaskParam(TaskVO taskVO) {
		
		List<TaskParamPO> TaskParamPOs = taskParamDao.queryTaskParam(taskVO.getTid());
		List<TaskParamVO> TaskParamVOs = new ArrayList<TaskParamVO>();
		
		TaskParamVO taskParamVO;
		
		for (TaskParamPO taskParamPO : TaskParamPOs) {
			
			taskParamVO = new TaskParamVO();
			
			BeanUtil.copyProperties(taskParamPO, taskParamVO);
			
			TaskParamVOs.add(taskParamVO);
		}
		
		return TaskParamVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addTaskParam(TaskParamVO taskParamVO) {
		
		TaskParamPO taskParamPO = new TaskParamPO();
		
		BeanUtil.copyProperties(taskParamVO, taskParamPO);
		
		taskParamDao.save(taskParamPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateTaskParam(TaskParamVO taskParamVO) {
		
		TaskParamPO taskParamPO = new TaskParamPO();
		
		BeanUtil.copyProperties(taskParamVO, taskParamPO);
		
		taskParamDao.update(taskParamPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateTaskParamForStatus(TaskParamVO taskParamVO) {
		
		TaskParamPO taskParamPO = taskParamDao.get(taskParamVO.getTpid());
		
		taskParamPO.setStatus(taskParamVO.getStatus());
		
		taskParamDao.update(taskParamPO);
		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteTaskParam(TaskParamVO taskParamVO) {
		
		TaskParamPO taskParamPO = taskParamDao.get(taskParamVO.getTpid());
		
		taskParamDao.delete(taskParamPO);
		
		return 0;
	}

}
