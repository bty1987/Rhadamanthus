package com.fanglin.production.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.production.dao.UserWorkflowDao;
import com.fanglin.production.po.UserWorkflowPO;
import com.fanglin.production.po.WorkflowPO;
import com.fanglin.production.service.UserWorkflowService;
import com.fanglin.production.vo.UserWorkflowVO;
import com.fanglin.production.vo.WorkflowVO;
import com.fanglin.utils.BeanUtil;

@Service("userWorkflowService")
@Transactional(readOnly = true)
public class UserWorkflowServiceImpl implements UserWorkflowService {

	@Autowired
	private UserWorkflowDao userWorkflowDao;

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
		long uid = userWorkflowVO.getUid();

		userWorkflowDao.deleteUserWorkflowByUId(uid);
		
		if(wfids !=null){
			for(long wfid: wfids) {
				userWorkflowDao.save(new UserWorkflowPO(uid,new WorkflowPO(wfid)));
			}
		}	
		return 0;
	}

}
