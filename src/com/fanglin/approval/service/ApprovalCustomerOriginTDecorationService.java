package com.fanglin.approval.service;

import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.approval.vo.ApprovalCustomerOriginTDecorationVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.interceptor.FLException;

public interface ApprovalCustomerOriginTDecorationService {

	public ApprovalCustomerOriginTDecorationVO queryApprovalCustomerOriginTDecoration(ApprovalVO approvalVO) throws FLException;

	public int submitApprovalForCustomerOriginTDecoration(ApprovalVO approvalVO, ApprovalCustomerOriginTDecorationVO approvalCustomerOriginTDecorationVO, String userId, int company) throws FLException;

	public int approvalForApprovalForCustomerOriginTDecoration(ApprovalPO approvalPO) throws FLException;

	public int refuseForApprovalForCustomerOriginTDecoration(ApprovalPO approvalPO) throws FLException;

}
