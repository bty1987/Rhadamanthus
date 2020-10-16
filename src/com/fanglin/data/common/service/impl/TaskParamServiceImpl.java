package com.fanglin.data.common.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.TaskParamDao;
import com.fanglin.data.common.service.TaskParamService;
import com.fanglin.data.common.vo.TaskParamVO;
import com.fanglin.data.po.TaskParamPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("taskParamService")
@Transactional(readOnly = true)
public class TaskParamServiceImpl implements TaskParamService {
	
	@Autowired
	private TaskParamDao taskParamDao;

	@Override
	public void pageTaskParam(Paging paging, List<Filter> filters) {
		
		List<TaskParamPO> taskParamPOs = taskParamDao.pageTaskParam(paging, filters);
		List<TaskParamVO> taskParamVOs = new ArrayList<TaskParamVO>();
		
		TaskParamVO taskParam;
		
		for (TaskParamPO taskParamPO : taskParamPOs) {
			
			taskParam = new TaskParamVO();
			
			BeanUtil.copyProperties(taskParamPO, taskParam);
			
			taskParamVOs.add(taskParam);
		}
		
		paging.setData(taskParamVOs);
	}
	
	@Override
	public List<TaskParamVO> queryTaskParam(TaskParamVO taskParam) {
		
		List<TaskParamPO> TaskParamPOs = taskParamDao.queryTaskParam(taskParam.getTid());
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
		
		TaskParamPO taskParam = new TaskParamPO();
			
		BeanUtil.copyProperties(taskParamVO, taskParam);
			
		taskParamDao.save(taskParam);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateTaskParam(TaskParamVO taskParamVO) {
		
		TaskParamPO taskParamPO = taskParamDao.get(taskParamVO.getTpid());
		
		if(taskParamPO != null){
			
			BeanUtil.copyProperties(taskParamVO, taskParamPO);
			
			taskParamDao.update(taskParamPO);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteTaskParam(TaskParamVO taskParamVO) {
		
		TaskParamPO taskParamPO = taskParamDao.get(taskParamVO.getTpid());
		
		if(taskParamPO != null){
			
			taskParamDao.delete(taskParamPO);
		}
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateTaskParamForStatus(TaskParamVO taskParamVO) {
		
		TaskParamPO taskParamPO = taskParamDao.get(taskParamVO.getTpid());
		
		if(taskParamPO != null){
			
			taskParamPO.setStatus(taskParamVO.getStatus());
			
			taskParamDao.update(taskParamPO);
		}
		
		return 0;
	}
	
	

}
