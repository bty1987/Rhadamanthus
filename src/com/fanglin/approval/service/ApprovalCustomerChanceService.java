package com.fanglin.approval.service;

import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.approval.vo.ApprovalCustomerChanceVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.interceptor.FLException;

public interface ApprovalCustomerChanceService {

	public ApprovalCustomerChanceVO queryApprovalCustomerChance(ApprovalVO approvalVO) throws FLException;

	public int submitApprovalForCustomerChance(ApprovalVO approvalVO, ApprovalCustomerChanceVO approvalCustomerChanceVO, String userId, int company) throws FLException;

	public int approveForCustomerChance(ApprovalPO approvalPO) throws FLException;

	public int refuseForCustomerChance(ApprovalPO approvalPO) throws FLException;

}
