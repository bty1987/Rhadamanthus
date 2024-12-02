package com.fanglin.approval.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.approval.dao.ApprovalFunctionDao;
import com.fanglin.approval.po.ApprovalFunctionPO;
import com.fanglin.approval.service.ApprovalFunctionService;
import com.fanglin.approval.vo.ApprovalFunctionVO;
import com.fanglin.utils.BeanUtil;

@Service("ApprovalFunctionService")
@Transactional(readOnly = true)
public class ApprovalFunctionServiceImpl implements ApprovalFunctionService {

	@Autowired
	private ApprovalFunctionDao approvalFunctionDao;

	@Override
	public List<ApprovalFunctionVO> queryApprovalFunction(ApprovalFunctionVO approvalFunctionVO) {

		List<ApprovalFunctionPO> approvalFunctionPOs = approvalFunctionDao.queryApprovalFunction(approvalFunctionVO.getType(), approvalFunctionVO.getFieldType());
		List<ApprovalFunctionVO> approvalFunctionVOs = new ArrayList<ApprovalFunctionVO>();

		for (ApprovalFunctionPO approvalFunctionPO : approvalFunctionPOs) {

			approvalFunctionVO = new ApprovalFunctionVO();

			BeanUtil.copyPropertie(approvalFunctionPO, approvalFunctionVO);

			approvalFunctionVOs.add(approvalFunctionVO);
		}

		return approvalFunctionVOs;
	}

}
