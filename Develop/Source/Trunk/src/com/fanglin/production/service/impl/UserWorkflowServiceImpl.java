package com.fanglin.production.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.production.dao.UserWorkflowDao;
import com.fanglin.production.dao.WorkflowDao;
import com.fanglin.production.po.UserWorkflowPO;
import com.fanglin.production.service.UserWorkflowService;
import com.fanglin.production.vo.UserWorkflowVO;
import com.fanglin.production.vo.WorkflowVO;
import com.fanglin.utils.BeanUtil;

@Service("userWorkflowService")
@Transactional(readOnly = true)
public class UserWorkflowServiceImpl implements UserWorkflowService {

	@Autowired
	private UserWorkflowDao userWorkflowDao;

	@Autowired
	private UserDao userDao;
	@Autowired
	private WorkflowDao workflowDao;

	@Override
	public List<UserWorkflowVO> queryUserWorkflowByUid(UserWorkflowVO userWorkflowVO) {

		List<UserWorkflowPO> userWorkflowPOs = userWorkflowDao.queryUserWorkflowByUid(userWorkflowVO.getUid());

		List<UserWorkflowVO> userWorkflowVOs = new ArrayList<UserWorkflowVO>();
		for (UserWorkflowPO userWorkflowPO : userWorkflowPOs) {
			userWorkflowVO = new UserWorkflowVO(new WorkflowVO());
			BeanUtil.copyProperties(userWorkflowPO, userWorkflowVO,Arrays.asList("workflow"));
			BeanUtil.copyProperties(userWorkflowPO.getWorkflow(),userWorkflowVO.getWorkflow());

			userWorkflowVOs.add(userWorkflowVO);
		}
		return userWorkflowVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateUserWorkflow(UserWorkflowVO userWorkflowVO,List<Long> wfids) throws FLException {
		int flag = 0;
		long uid = userWorkflowVO.getUid();
		int uId = (int) uid;
		UserPO userPO = userDao.get(uId);
		if (userPO == null) {
			throw new FLException(190005, "人员不存在");
		}
		List<UserWorkflowPO> userWorkflowPOs = userWorkflowDao.queryUserWorkflowByUid(uid);
		if (userWorkflowPOs.size() == 0 && wfids.size() > 0) {
			for (Long wfid : wfids) {
				UserWorkflowPO userWorkflowPO = new UserWorkflowPO(uid, workflowDao.get(wfid));
				userWorkflowDao.save(userWorkflowPO);
			}
		} else if(userWorkflowPOs.size() != 0 && wfids.size() > 0){
			for (Long wfid : wfids) {
				for (UserWorkflowPO userWorkflow : userWorkflowPOs) {
					if (userWorkflow.getWorkflow().getWfid() == wfid) {
						userWorkflowDao.delete(userWorkflow);
						flag = 1;
					}	
				}
				
				if (flag == 0) {
				UserWorkflowPO userWorkflowPO = new UserWorkflowPO(uid, workflowDao.get(wfid));
				userWorkflowDao.save(userWorkflowPO);
				}
				flag = 0;
			}
		}
		return 0;
	}

}
