/**
 * Title: approverServiceImpl
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

import com.fanglin.approval.dao.ApproverDao;
import com.fanglin.approval.po.ApproverPO;
import com.fanglin.approval.service.ApproverService;
import com.fanglin.approval.vo.ApproverVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.vo.DutyVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("approverSercie")
@Transactional(readOnly = true)
public class ApproverServiceImpl implements ApproverService {

	@Autowired
	private ApproverDao approverDao;

	@Autowired
	private UserDao userDao;
	
	@Override
	public void pageApprover(Paging paging, List<Filter> filters,int company) {
		
		List<ApproverPO> approverPOs = approverDao.pageApprover(paging, filters,company);
		List<ApproverVO> approverVOs = new ArrayList<ApproverVO>();

		for (ApproverPO approverPO : approverPOs) {
	
			ApproverVO approverVO = new ApproverVO(new UserBaseVO(new DutyVO()));
			
			BeanUtil.copyProperties(approverPO, approverVO,Arrays.asList("user"));

			BeanUtil.copyProperties(approverPO.getUser(),approverVO.getUserBase(), Arrays.asList( "dept","duty"));
			BeanUtil.copyProperties(approverPO.getUser().getDuty(),approverVO.getUserBase().getDuty(), Arrays.asList("departmentType"));
			
			approverVOs.add(approverVO);
			}
		paging.setData(approverVOs);
	}
	@Override
	public List<ApproverVO> queryApprovalUserByType(ApproverVO userApproveVO, int company) {

		List<ApproverPO> approverPOs = approverDao.queryApprovalUserByType(userApproveVO.getType(),company);
		
		List<ApproverVO> approverVOs = new ArrayList<ApproverVO>();
		
		for (ApproverPO approverPO : approverPOs) {
		
			ApproverVO approverVO = new ApproverVO();
			BeanUtil.copyProperties(approverPO,approverVO,Arrays.asList("user"));
			approverVO.setUserBase(new UserBaseVO());
			BeanUtil.copyProperties(approverPO.getUser(),approverVO.getUserBase(), Arrays.asList("dept","duty"));
			
			approverVOs.add(approverVO);
		}
		
		return approverVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addApprover(ApproverVO approverVO) throws FLException {

		List<ApproverPO> approvers = approverDao.queryApproverByUserId(approverVO.getUserBase().getUserId());

		for (ApproverPO approver : approvers) {
			if (approver.getType()==approverVO.getType()) {
				throw new FLException(230008, "审批人员已有该审批权限");
			}
		}

		ApproverPO approverPO = new ApproverPO();
		UserPO user= userDao.queryUserByUserId(approverVO.getUserBase().getUserId());
		approverPO.setType(approverVO.getType());
		approverPO.setUser(user);
		approverPO.setComment(approverVO.getComment());
		
		approverDao.save(approverPO);

		return 0;
	}


	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deleteApprover(List<Integer> ids) {

		for (Integer id : ids) {
			deleteApproverById(id);
		}
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deleteApproverById(Integer approveId) {

		approverDao.deleteById(approveId);
	}

}
