/**
 * @File Name		: ApprovalServiceImpl.java
 * @Package   	: com.fanglin.customer.service.impl
 * @Version		: 1.0
 * @Date			: 2020-6-8
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.customer.service.impl;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.approval.dao.ApprovalDao;
import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.service.ApprovalService;
import com.fanglin.customer.vo.ApprovalVO;
import com.fanglin.utils.BeanUtil;

@Service("approvalOrderService")
@Transactional(readOnly = true)
public class ApprovalServiceImpl implements ApprovalService {

	@Autowired
	private ApprovalDao approvalDao;

	@Override
	public ApprovalVO queryApproval(ApprovalVO approvalVO) {

		ApprovalPO approvalPO = approvalDao.get(approvalVO.getAid());

		if (approvalPO == null)
			return approvalVO;

		BeanUtil.copyProperties(approvalPO, approvalVO, Arrays.asList("receiver", "sender"));

		return approvalVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int confirmApproval(ApprovalVO approvalVO) throws FLException {

		ApprovalPO approvalPO = approvalDao.get(approvalVO.getAid());

		if (approvalPO == null) {
			throw new FLException(240009, "审批信息不存在");
		}

		if (approvalPO.getStatus() != ApprovalPO.APPROVAL_STATUS_CONFIRM_INT) {
			throw new FLException(240008, "审批状态不可操作");
		}

		approvalPO.setStatus(ApprovalPO.APPROVAL_STATUS_INIT_INT);

		approvalDao.update(approvalPO);

		return 0;
	}

}
