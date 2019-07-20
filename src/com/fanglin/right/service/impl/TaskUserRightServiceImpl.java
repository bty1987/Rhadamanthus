package com.fanglin.right.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.information.po.TaskPO;
import com.fanglin.information.vo.TaskVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.right.dao.TaskUserRightDao;
import com.fanglin.right.po.TaskUserRightPO;
import com.fanglin.right.service.TaskUserRightService;
import com.fanglin.right.vo.TaskUserRightVO;
import com.fanglin.utils.BeanUtil;

@Service("taskUserRightService")
@Transactional(readOnly=true)
public class TaskUserRightServiceImpl implements TaskUserRightService {
	
	@Autowired
	private TaskUserRightDao taskUserRightDao;
	
	@Autowired
	private UserDao userDao;
	
	@Override
	public List<TaskVO> queryTaskUserRightByUserId(UserVO userVO, int company) throws FLException {
		
		UserPO userPO = userDao.queryUserByUserId(userVO.getUserId());
		
		if(userPO == null){
			throw new FLException(190005, "人员不存在");
		}
		
		List<TaskUserRightPO> taskUserRightPOs = taskUserRightDao.queryTaskUserRightByUserId(userPO.getUid(), company);
		List<TaskVO> taskVOs = new ArrayList<TaskVO>();
		
		for (TaskUserRightPO taskUserRightPO : taskUserRightPOs) {
			
			TaskUserRightVO taskUserRightVO = new TaskUserRightVO();
			taskUserRightVO.setTask(new TaskVO());
			
			BeanUtil.copyPropertie(taskUserRightPO.getTask(), taskUserRightVO.getTask());
			
			taskVOs.add(taskUserRightVO.getTask());
		}
		
		return taskVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateTaskUserRight(List<TaskVO> taskVOs, UserVO userVO, int company) throws FLException {
		
		UserPO userPO = userDao.queryUserByUserId(userVO.getUserId());
		
		taskUserRightDao.deleteTaskUserRightByUid(userPO.getUid(), company);
		
		if(taskVOs != null){
			for (TaskVO taskVO : taskVOs) {
				taskUserRightDao.save(new TaskUserRightPO(userPO.getUid(), new TaskPO(taskVO.getTid()), company));
			}
		}
		
	}

}
