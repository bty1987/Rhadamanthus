/**
 * Title: UserApproveServiceImpl
 * Description:
 * Copyright: Copyright (c) 2014 All rights reserved.
 * Company: 
 * @author bty1987
 *
 */

package com.fanglin.personel.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.dao.UserApproveDao;
import com.fanglin.personel.po.UserApprovePO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserApproveVO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("userApproveSercie")
@Transactional(readOnly = true)
public class UserApproveServiceImpl implements UserApproveService {

	@Autowired
	private UserApproveDao userApproveDao;
	
	@Override
	public void pageUserApprove(Paging paging, List<Filter> filters){

		List<UserApprovePO> userApprovePOs = userApproveDao.pageUserApprove(paging, filters);
		List<UserApproveVO> userApproveVOs = new ArrayList<UserApproveVO>();
		
		for(UserApprovePO userApprovePO: userApprovePOs){
			UserApproveVO userApproveVO = new UserApproveVO();
			BeanUtil.copyProperties(userApprovePO, userApproveVO, Arrays.asList("user"));
			
			userApproveVO.setUser(new UserVO());
			BeanUtil.copyProperties(userApprovePO.getUser(), userApproveVO.getUser(), Arrays.asList("role", "dept"));
			
			userApproveVOs.add(userApproveVO);
		}
		
		paging.setData(userApproveVOs);
	}
	
	public List<UserApproveVO> queryApproveUserForNameByType(UserVO userVO, UserApproveVO userApproveVO){
		Paging paging = new Paging();
		paging.setPage(0);
		paging.setRows(50);
		
		List<UserApprovePO> userApprovePOs = userApproveDao.queryApproveUserForNameByType(paging, userVO.getUserNamePinYin(), userApproveVO.getType());
		List<UserApproveVO> userApproveVOs = new ArrayList<UserApproveVO>();
		
		for(UserApprovePO userApprovePO: userApprovePOs){
			UserApproveVO _userApproveVO = new UserApproveVO();
			BeanUtil.copyProperties(userApprovePO, _userApproveVO, Arrays.asList("user"));
			
			_userApproveVO.setUser(new UserVO());
			BeanUtil.copyProperties(userApprovePO.getUser(), _userApproveVO.getUser(), Arrays.asList("role", "dept"));
			
			userApproveVOs.add(_userApproveVO);
		}
		
		return userApproveVOs;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addUserApprove(UserApproveVO userApproveVO) throws FLException{
		
		List<UserApprovePO> userApproves = userApproveDao.queryApproveUserByUserId(userApproveVO.getUser().getUserId());
		
		for(UserApprovePO userApprove: userApproves){
			if(userApprove.getType().equals(userApproveVO.getType())){
				throw new FLException(230008, "审批人员已有该审批权限");
			}
		}

		UserApprovePO userApprovePO = new UserApprovePO();
		BeanUtil.copyProperties(userApproveVO, userApprovePO, Arrays.asList("user"));
		
		userApprovePO.setUser(new UserPO());
		BeanUtil.copyProperties(userApproveVO.getUser(), userApprovePO.getUser());
		
		userApproveDao.saveOrUpdate(userApprovePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateUserApprove(UserApproveVO userApproveVO) throws FLException{
		
		UserApprovePO userApprovePO = userApproveDao.get(userApproveVO.getApproveId());
		
		if(!userApprovePO.getType().equals(userApproveVO.getType())){
			List<UserApprovePO> userApproves = userApproveDao.queryApproveUserByUserId(userApproveVO.getUser().getUserId());
			
			for(UserApprovePO userApprove: userApproves){
				if(userApprove.getType().equals(userApproveVO.getType())){
					throw new FLException(230008, "审批人员已有该审批权限");
				}
			}
		}

		BeanUtil.copyProperties(userApproveVO, userApprovePO, Arrays.asList("user"));
		
		userApprovePO.setUser(new UserPO());
		BeanUtil.copyProperties(userApproveVO.getUser(), userApprovePO.getUser());
		
		userApproveDao.saveOrUpdate(userApprovePO);

		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteUserApprove(List<Integer> ids){

	    for(Integer id: ids){
	        deleteUserApproveById(id);
	    }
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteUserApproveById(Integer approveId){
		
		userApproveDao.deleteById(approveId);
	}

}
