package com.fanglin.approval.service;

import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.approval.vo.ApprovalDecorationHolonomyVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.interceptor.FLException;

public interface ApprovalDecorationHolonomyService {

	public int submitApprovalForDecorationHolonomy(ApprovalVO approvalVO, ApprovalDecorationHolonomyVO approvalDecorationHolonomyVO, String userId, int company) throws FLException;

	public int approveForDecorationHolonomy(ApprovalPO approvalPO) throws FLException;

}
