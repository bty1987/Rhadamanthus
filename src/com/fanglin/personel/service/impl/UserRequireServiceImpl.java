package com.fanglin.personel.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.dao.UserRequireDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.po.UserRequirePO;
import com.fanglin.personel.service.UserRequireService;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.personel.vo.UserRequireVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("userRequireService")
@Transactional(readOnly = true)
public class UserRequireServiceImpl implements UserRequireService{
	
	@Autowired
	private UserRequireDao userRequireDao;
	
	@Autowired
	private UserDao userDao;

	@Override
	public void pageUserRequire(Paging paging, List<Filter> filters) {
		
		List<UserRequirePO> userRequirePOs = userRequireDao.pageUserRequire(paging, filters);
		List<UserRequireVO> userRequireVOs = new ArrayList<UserRequireVO>();
		
		UserRequireVO userRequireVO;
		
		for (UserRequirePO userRequirePO : userRequirePOs) {
			
			userRequireVO = new UserRequireVO(new UserBaseVO(), new DepartmentVO(), new UserBaseVO());
			
			BeanUtil.copyProperties(userRequirePO, userRequireVO, Arrays.asList("creater","dept","receiveId"));
			BeanUtil.copyProperties(userRequirePO.getCreater(), userRequireVO.getCreater(), Arrays.asList("dept","duty","role"));
			BeanUtil.copyProperties(userRequirePO.getReceiveId(), userRequireVO.getReceiveId(), Arrays.asList("dept","duty","role"));
			BeanUtil.copyProperties(userRequirePO.getDept(), userRequireVO.getDept(), Arrays.asList("type","fatherDept","manager"));
			
			userRequireVOs.add(userRequireVO);
			
		}
		
		paging.setData(userRequireVOs);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addUserRequire(UserRequireVO userRequireVO, String userId) {

		UserPO creater = userDao.queryUserByUserId(userId);
		
		UserRequirePO userRequirePO = new UserRequirePO(creater, creater.getDept(), creater);
		
		BeanUtil.copyProperties(userRequireVO, userRequirePO, Arrays.asList("creater","dept","receiveId"));
		userRequirePO.setType(userRequireVO.getType());
		userRequirePO.setStatus(UserRequirePO.STATUS_INIT_INT);
		userRequirePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		
		userRequireDao.save(userRequirePO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void approveUserRequire(UserRequireVO userRequireVO) throws FLException {
		
		UserRequirePO userRequirePO = userRequireDao.get(userRequireVO.getUrid());
		
		if(userRequirePO == null){
			throw new FLException(190009, "人员需求不存在");
		}
		
		if(userRequirePO.getStatus() != UserRequirePO.STATUS_INIT_INT){
				throw new FLException(190010 , "人员需求不可操作");
		}
				
		userRequirePO.setStatus(UserRequirePO.STATUS_THROUGH_INT);
		userRequirePO.setApproveTime(DateUtil.getDateToTimestamp(new Date()));
		
		userRequireDao.update(userRequirePO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void refuseUserRequire(UserRequireVO userRequireVO) throws FLException {
		
		UserRequirePO userRequirePO = userRequireDao.get(userRequireVO.getUrid());
		
		if(userRequirePO == null){
			throw new FLException(190009, "人员需求不存在");
		}
		
		if(userRequirePO.getStatus() != UserRequirePO.STATUS_INIT_INT){
				
			throw new FLException(190010 , "人员需求不可操作");
				
		}
				
		userRequirePO.setStatus(UserRequirePO.STATUS_REFUSED_INT);
		userRequirePO.setApproveTime(DateUtil.getDateToTimestamp(new Date()));
		
		userRequireDao.update(userRequirePO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void finishUserRequire(UserRequireVO userRequireVO) throws FLException {
		
		UserRequirePO userRequirePO = userRequireDao.get(userRequireVO.getUrid());
		
		if(userRequirePO == null){
			throw new FLException(190009, "人员需求不存在");
		}
		
		if(userRequirePO.getStatus() != UserRequirePO.STATUS_THROUGH_INT){
			throw new FLException(190010 , "人员需求不可操作");
		}
				
		userRequirePO.setStatus(UserRequirePO.STATUS_COMPLETE_INT);
		userRequirePO.setFinishTime(DateUtil.getDateToTimestamp(new Date()));
		
		userRequireDao.update(userRequirePO);
	}
}
