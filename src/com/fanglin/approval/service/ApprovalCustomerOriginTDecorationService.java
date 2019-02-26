package com.fanglin.approval.service;

import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.approval.vo.ApprovalCustomerOriginTDecorationVO;
import com.fanglin.core.interceptor.FLException;

public interface ApprovalCustomerOriginTDecorationService {

	public int submitApprovalForCustomerOriginTDecoration(String userId, String code, String forms, String approver, ApprovalCustomerOriginTDecorationVO approvalCustomerOriginTDecorationVO, int company) throws FLException;
	
	public int approvalForApprovalForCustomerOriginTDecoration(ApprovalPO approvalPO) throws FLException;
	
	public int refuseForApprovalForCustomerOriginTDecoration(ApprovalPO approvalPO) throws FLException;
	
}
