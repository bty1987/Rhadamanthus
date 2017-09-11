/**
 * Title: approveUserServiceImpl
 * Description:
 * Copyright: Copyright (c) 2014 All rights reserved.
 * Company: 
 * @author bty1987
 *
 */

package com.fanglin.approval.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.approval.dao.ApproveUserDao;
import com.fanglin.approval.po.ApproveUserPO;
import com.fanglin.approval.service.ApproveUserService;
import com.fanglin.approval.vo.ApproveUserVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("approveUserSercie")
@Transactional(readOnly = true)
public class ApproveUserServiceImpl implements ApproveUserService {

	@Autowired
	private ApproveUserDao approveUserDao;

	@Autowired
	private UserDao userDao;
	
	@Override
	public void pageApproveUser(Paging paging, List<Filter> filters,int company) {
		
		List<ApproveUserPO> approveUserPOs = approveUserDao.pageApproveUser(paging, filters,company);
		List<ApproveUserVO> approveUserVOs = new ArrayList<ApproveUserVO>();

		for (ApproveUserPO approveUserPO : approveUserPOs) {
	
			ApproveUserVO approveUserVO = new ApproveUserVO(new UserVO());
			BeanUtil.copyProperties(approveUserPO, approveUserVO,Arrays.asList("user"));

			BeanUtil.copyProperties(approveUserPO.getUser(),approveUserVO.getUser(), Arrays.asList("role", "dept"));

			approveUserVOs.add(approveUserVO);
			}

		paging.setData(approveUserVOs);
	}

	@Override
	public List<ApproveUserVO> queryApprovalUserByType(ApproveUserVO userApproveVO, int company) {

		List<ApproveUserPO> approveUserPOs = approveUserDao.queryApprovalUserByType(userApproveVO.getType(),company);
		
		List<ApproveUserVO> approveUserVOs = new ArrayList<ApproveUserVO>();
		
		for (ApproveUserPO approveUserPO : approveUserPOs) {
		
			ApproveUserVO approveUserVO = new ApproveUserVO();
			BeanUtil.copyProperties(approveUserPO,approveUserVO,Arrays.asList("user"));
			approveUserVO.setUser(new UserVO());
			BeanUtil.copyProperties(approveUserPO.getUser(),approveUserVO.getUser(), Arrays.asList("role", "dept"));
			
			approveUserVOs.add(approveUserVO);
		}
		
		return approveUserVOs;
	}
	
	public List<ApproveUserVO> queryApproveUserForNameByType(UserVO userVO,	ApproveUserVO approveUserVO,int company) {
		Paging paging = new Paging();
		paging.setPage(0);
		paging.setRows(50);

		List<ApproveUserPO> approveUserPOs = approveUserDao.queryApproveUserForNameByType(paging,userVO.getUserNamePinYin(), approveUserVO.getType(),company);
		List<ApproveUserVO> approveUserVOs = new ArrayList<ApproveUserVO>();

		for (ApproveUserPO approveUserPO : approveUserPOs) {
			ApproveUserVO _approveUserVO = new ApproveUserVO();
			BeanUtil.copyProperties(approveUserPO, _approveUserVO,Arrays.asList("user"));
			
			_approveUserVO.setUser(new UserVO());
			BeanUtil.copyProperties(approveUserPO.getUser(),_approveUserVO.getUser(), Arrays.asList("role", "dept"));

			approveUserVOs.add(_approveUserVO);
			}
		return approveUserVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addApproveUser(ApproveUserVO approveUserVO) throws FLException {

		List<ApproveUserPO> approveUsers = approveUserDao.queryApproveUserByUserId(approveUserVO.getUser().getUserId());

		for (ApproveUserPO approveUser : approveUsers) {
			if (approveUser.getType()==approveUserVO.getType()) {
				throw new FLException(230008, "审批人员已有该审批权限");
			}
		}

		ApproveUserPO approveUserPO = new ApproveUserPO();
		UserPO user= userDao.queryUserByUserId(approveUserVO.getUser().getUserId());
		approveUserPO.setType(approveUserVO.getType());
		approveUserPO.setUser(user);
		approveUserPO.setComment(approveUserVO.getComment());
		
		approveUserDao.save(approveUserPO);

		return 0;
	}


	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deleteApproveUser(List<Integer> ids) {

		for (Integer id : ids) {
			deleteApproveUserById(id);
		}
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deleteApproveUserById(Integer approveId) {

		approveUserDao.deleteById(approveId);
	}

}
