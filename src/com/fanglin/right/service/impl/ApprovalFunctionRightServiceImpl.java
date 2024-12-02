package com.fanglin.right.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.approval.po.ApprovalFunctionPO;
import com.fanglin.approval.vo.ApprovalFunctionVO;
import com.fanglin.right.dao.ApprovalFunctionRightDao;
import com.fanglin.right.po.ApprovalFunctionRightPO;
import com.fanglin.right.service.ApprovalFunctionRightService;
import com.fanglin.right.vo.ApprovalFunctionRightVO;
import com.fanglin.utils.BeanUtil;

@Service("ApprovalFunctionRightService")
@Transactional(readOnly = true)
public class ApprovalFunctionRightServiceImpl implements ApprovalFunctionRightService {

	@Autowired
	private ApprovalFunctionRightDao approvalFunctionRightDao;

	@Override
	public List<ApprovalFunctionRightVO> queryApprovalFunctionRight(ApprovalFunctionRightVO approvalFunctionRightVO) {

		List<ApprovalFunctionRightPO> approvalFunctionRightPOs = approvalFunctionRightDao.queryApprovalFunctionRight(approvalFunctionRightVO.getName());
		List<ApprovalFunctionRightVO> approvalFunctionRightVOs = new ArrayList<ApprovalFunctionRightVO>();

		for (ApprovalFunctionRightPO approvalFunctionRightPO : approvalFunctionRightPOs) {

			approvalFunctionRightVO = new ApprovalFunctionRightVO(new ApprovalFunctionVO());

			BeanUtil.copyPropertie(approvalFunctionRightPO, approvalFunctionRightVO, Arrays.asList("approvalFunction"));
			BeanUtil.copyPropertie(approvalFunctionRightPO.getApprovalFunction(), approvalFunctionRightVO.getApprovalFunction());

			approvalFunctionRightVOs.add(approvalFunctionRightVO);
		}

		return approvalFunctionRightVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateApprovalFunctionRight(ApprovalFunctionRightVO approvalFunctionRightVO, List<Long> cfids, int company) {

		approvalFunctionRightDao.deleteApprovalFunctionRightByName(approvalFunctionRightVO.getName());

		for (Long cfid : cfids) {

			ApprovalFunctionRightPO approvalFunctionRightPO = new ApprovalFunctionRightPO();

			approvalFunctionRightPO.setName(approvalFunctionRightVO.getName());
			approvalFunctionRightPO.setApprovalFunction(new ApprovalFunctionPO(cfid));
			approvalFunctionRightPO.setCompany(company);

			approvalFunctionRightDao.save(approvalFunctionRightPO);
		}
	}

}
