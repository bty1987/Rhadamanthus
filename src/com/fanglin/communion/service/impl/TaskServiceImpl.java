package com.fanglin.communion.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.RoleTaskDao;
import com.fanglin.communion.dao.TaskDao;
import com.fanglin.communion.po.RoleTaskPO;
import com.fanglin.communion.po.TaskPO;
import com.fanglin.communion.service.TaskService;
import com.fanglin.communion.vo.TaskVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.dao.UserRoleDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.po.UserRolePO;
import com.fanglin.system.dao.RoleDao;
import com.fanglin.system.po.RolePO;
import com.fanglin.system.service.impl.CompanyServiceImpl;
import com.fanglin.system.vo.CompanyVO;
import com.fanglin.system.vo.RoleVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("taskService")
@Transactional(readOnly = true)
public class TaskServiceImpl implements TaskService {

	@Autowired
	private TaskDao taskDao;

	@Autowired
	private RoleDao roleDao;

	@Autowired
	private RoleTaskDao roleTaskDao;

	@Autowired
	private UserRoleDao userRoleDao;

	@Autowired
	private UserDao userDao;

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
	public List<TaskVO> queryTaskByRid(RoleVO roleVO, Integer company) {

		List<RoleTaskPO> roleTaskPOs = roleTaskDao.queryRoleTask(roleVO.getRid(), company);
		List<TaskVO> taskVOs = new ArrayList<TaskVO>();

		for (RoleTaskPO roleTaskPO : roleTaskPOs) {

			TaskVO taskVO = new TaskVO();

			BeanUtil.copyPropertie(roleTaskPO.getTask(), taskVO);

			taskVOs.add(taskVO);
		}

		return taskVOs;
	}

	@Override
	public List<TaskVO> queryTaskForSelf(String userId, Integer company) throws FLException {

		UserPO userPO = userDao.queryUserByUserId(userId);

		if (userPO == null) {
			throw new FLException(220005, "员工不存在");
		}

		List<TaskVO> taskVOs = new ArrayList<TaskVO>();

		List<UserRolePO> userRolePOs = userRoleDao.queryUserRole(userPO.getUid());

		List<Integer> rids = new ArrayList<Integer>(Arrays.asList(userPO.getRole().getRid()));

		for (UserRolePO userRolePO : userRolePOs) {
			rids.add(userRolePO.getRole().getRid());
		}

		List<RoleTaskPO> roleTaskPOs = roleTaskDao.queryRoleTask(rids, company);

		TaskVO taskVO;

		for (RoleTaskPO roleTaskPO : roleTaskPOs) {

			taskVO = new TaskVO();

			BeanUtil.copyPropertie(roleTaskPO.getTask(), taskVO);

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
	public int updateTask(TaskVO taskVO) throws FLException {

		TaskPO taskPO = taskDao.get(taskVO.getTid());

		if (taskPO == null) {
			throw new FLException(160027, "任务不存在");
		}

		BeanUtil.copyProperties(taskVO, taskPO);

		taskDao.update(taskPO);

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

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateRoleTask(RoleVO roleVO, TaskVO taskVO, String userId, Integer company) throws FLException {

		RolePO rolePO = roleDao.get(roleVO.getRid());

		if (rolePO == null) {
			throw new FLException(230010, "角色不存在");
		}

		UserPO operator = userDao.queryUserByUserId(userId);

		if (operator.getRole().getLevel() < rolePO.getLevel()) {
			throw new FLException(-1, "无操作权限");
		}

		if (operator.getRole().getRid() == rolePO.getRid()) {
			throw new FLException(-1, "无操作权限");
		}

		RoleTaskPO roleTaskPO = roleTaskDao.queryRoleTask(roleVO.getRid(), taskVO.getTid(), company);

		if (roleTaskPO == null) roleTaskDao.save(new RoleTaskPO(rolePO.getRid(), new TaskPO(taskVO.getTid()), operator, company));
		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteRoleTask(RoleVO roleVO, TaskVO taskVO, Integer company) throws FLException {

		RoleTaskPO roleTaskPO = roleTaskDao.queryRoleTask(roleVO.getRid(), taskVO.getTid(), company);

		if (roleTaskPO != null) roleTaskDao.delete(roleTaskPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int syncRoleTask(RoleVO roleVO, List<CompanyVO> companyVOs, String userId, Integer company) throws FLException {

		List<Integer> cids = new ArrayList<Integer>();

		for (CompanyVO companyVO : companyVOs) {
			cids.add(CompanyServiceImpl.decode(companyVO.getCid()));
		}

		UserPO operater = userDao.queryUserByUserId(userId);

		roleTaskDao.deleteRoleTask(roleVO.getRid(), cids);
		roleTaskDao.syncRoleTask(roleVO.getRid(), operater.getUid(), cids, company);

		return 0;
	}
}
