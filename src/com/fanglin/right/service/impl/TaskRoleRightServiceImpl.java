package com.fanglin.right.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.vo.TaskVO;
import com.fanglin.data.po.TaskPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.dao.UserRoleDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.po.UserRolePO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.right.dao.TaskRoleRightDao;
import com.fanglin.right.po.TaskRoleRightPO;
import com.fanglin.right.service.TaskRoleRightService;
import com.fanglin.right.vo.TaskRoleRightVO;
import com.fanglin.system.dao.RoleDao;
import com.fanglin.system.po.RolePO;
import com.fanglin.utils.BeanUtil;

@Service("taskRoleRightService")
@Transactional(readOnly = true)
public class TaskRoleRightServiceImpl implements TaskRoleRightService {

	@Autowired
	private TaskRoleRightDao taskRoleRightDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private RoleDao roleDao;

	@Autowired
	private UserRoleDao userRoleDao;

	@Override
	public List<TaskRoleRightVO> queryTaskRoleRightByRid(TaskRoleRightVO taskRoleRightVO) {

		List<TaskRoleRightPO> taskRoleRightPOs = taskRoleRightDao.queryTaskRoleRight(taskRoleRightVO.getRid());
		List<TaskRoleRightVO> taskRoleRightVOs = new ArrayList<TaskRoleRightVO>();

		for (TaskRoleRightPO taskRoleRightPO : taskRoleRightPOs) {

			taskRoleRightVO = new TaskRoleRightVO(new TaskVO(), new UserBaseVO());

			BeanUtil.copyPropertie(taskRoleRightPO, taskRoleRightVO, Arrays.asList("task", "creater"));
			BeanUtil.copyPropertie(taskRoleRightPO.getTask(), taskRoleRightVO.getTask());

			taskRoleRightVOs.add(taskRoleRightVO);
		}

		return taskRoleRightVOs;
	}

	@Override
	public List<TaskRoleRightVO> queryTaskRoleRightForSelf(String userId) throws FLException {

		UserPO userPO = userDao.queryUserByUserId(userId);

		if (userPO == null) {
			throw new FLException(220005, "员工不存在");
		}

		List<TaskRoleRightVO> taskRoleRightVOs = new ArrayList<TaskRoleRightVO>();

		List<UserRolePO> userRolePOs = userRoleDao.queryUserRole(userPO.getUid());

		if (userRolePOs == null || userRolePOs.size() == 0) return taskRoleRightVOs;

		List<Integer> rids = new ArrayList<Integer>();

		for (UserRolePO userRolePO : userRolePOs) {
			rids.add(userRolePO.getRole().getRid());
		}

		List<TaskRoleRightPO> taskRoleRightPOs = taskRoleRightDao.queryTaskRoleRight(rids);

		TaskRoleRightVO taskRoleRightVO;

		for (TaskRoleRightPO taskRoleRightPO : taskRoleRightPOs) {

			taskRoleRightVO = new TaskRoleRightVO(new TaskVO(), new UserBaseVO());

			BeanUtil.copyPropertie(taskRoleRightPO, taskRoleRightVO, Arrays.asList("task", "creater"));
			BeanUtil.copyPropertie(taskRoleRightPO.getTask(), taskRoleRightVO.getTask());

			taskRoleRightVOs.add(taskRoleRightVO);

		}

		return taskRoleRightVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateTaskRoleRight(TaskRoleRightVO taskRoleRightVO, List<Long> tids, String userId) throws FLException {

		Integer rid = taskRoleRightVO.getRid();

		RolePO rolePO = roleDao.get(rid);

		if (rolePO == null) {
			throw new FLException(230010, "角色不存在");
		}

		taskRoleRightDao.deleteTaskRoleRight(rid);

		UserPO operator = userDao.queryUserByUserId(userId);

		if (operator.getRole().getRid() == rolePO.getRid()) {
			throw new FLException(-1, "无操作权限");
		}

		if (operator.getRole().getLevel() < rolePO.getLevel()) {
			throw new FLException(-1, "无操作权限");
		}

		if (tids == null || tids.size() == 0) return;

		for (Long tid : tids) {
			taskRoleRightDao.save(new TaskRoleRightPO(rid, new TaskPO(tid), operator));
		}

	}

}
