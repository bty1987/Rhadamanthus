/**
 * @File Name		: ApprovalCommonServiceImpl.java
 * @Package   	: com.fanglin.approval.service.impl
 * @Version		: 1.0
 * @Date			: 2019-4-18
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.approval.service.impl;

import org.apache.struts2.convention.annotation.ParentPackage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONArray;
import com.fanglin.approval.dao.ApprovalDao;
import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.approval.service.ApprovalCommonService;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.dingding.service.DingTalkApprovalService;

@ParentPackage("common")
@Service("approvalCommonService")
public class ApprovalCommonServiceImpl implements ApprovalCommonService {

	@Autowired
	private ApprovalDao approvalDao;

	@Autowired
	private DingTalkApprovalService approvalDDService;

	@Override
	public int submitApprovalForDing(String code, String forms, String userId, int company) throws FLException {

		JSONArray form = JSONArray.parseArray(forms);

		approvalDDService.initiateApproval(code, userId, null, null, null, form, company);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int confirmApproval(ApprovalVO approvalVO) throws FLException {

		ApprovalPO approvalPO = approvalDao.get(approvalVO.getAid());

		if (approvalPO == null) {
			throw new FLException(240009, "审批信息不存在");
		}

		if (approvalPO.getStatus() != ApprovalPO.APPROVAL_STATUS_CONFIRMED_INT) {
			throw new FLException(240077, "审批状态不可操作");
		}

		approvalPO.setStatus(ApprovalPO.APPROVAL_STATUS_CONFIRM_INT);

		approvalDao.update(approvalPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int rejectApproval(ApprovalVO approvalVO) throws FLException {

		ApprovalPO approvalPO = approvalDao.get(approvalVO.getAid());

		if (approvalPO == null) {
			throw new FLException(240009, "审批信息不存在");
		}

		if (approvalPO.getStatus() != ApprovalPO.APPROVAL_STATUS_CONFIRMED_INT) {
			throw new FLException(240077, "审批状态不可操作");
		}

		approvalPO.setStatus(ApprovalPO.APPROVAL_STATUS_REJECT_INT);

		approvalDao.update(approvalPO);

		return 0;
	}

}
