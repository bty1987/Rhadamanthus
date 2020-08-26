package com.fanglin.right.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.data.common.vo.TaskVO;
import com.fanglin.data.po.TaskPO;
import com.fanglin.right.dao.TaskRoleRightDao;
import com.fanglin.right.po.TaskRoleRightPO;
import com.fanglin.right.service.TaskRoleRightService;
import com.fanglin.right.vo.TaskRoleRightVO;
import com.fanglin.utils.BeanUtil;

@Service("taskRoleRightService")
@Transactional(readOnly = true)
public class TaskRoleRightServiceImpl implements TaskRoleRightService {

	@Autowired
	private TaskRoleRightDao taskRoleRightDao;

	@Override
	public List<TaskRoleRightVO> queryTaskRoleRightByUserId(TaskRoleRightVO taskRoleRightVO) {

		List<TaskRoleRightPO> taskRoleRightPOs = taskRoleRightDao.queryTaskRoleRightByUserId(taskRoleRightVO.getRid());
		List<TaskRoleRightVO> taskRoleRightVOs = new ArrayList<TaskRoleRightVO>();

		for (TaskRoleRightPO taskRoleRightPO : taskRoleRightPOs) {

			taskRoleRightVO = new TaskRoleRightVO(new TaskVO());

			BeanUtil.copyPropertie(taskRoleRightPO, taskRoleRightVO, Arrays.asList("task"));
			BeanUtil.copyPropertie(taskRoleRightPO.getTask(), taskRoleRightVO.getTask());

			taskRoleRightVOs.add(taskRoleRightVO);

		}

		return taskRoleRightVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateTaskRoleRight(TaskRoleRightVO taskRoleRightVO, List<Long> tids) {

		Long rid = taskRoleRightVO.getRid();

		taskRoleRightDao.deleteTaskRoleRight(rid);

		if (tids != null) {
			for (Long tid : tids) {
				taskRoleRightDao.save(new TaskRoleRightPO(rid, new TaskPO(tid)));
			}
		}

	}

}
