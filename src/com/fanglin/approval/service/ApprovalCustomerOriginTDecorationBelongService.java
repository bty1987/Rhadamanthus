package com.fanglin.approval.service;

import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.core.interceptor.FLException;

public interface ApprovalCustomerOriginTDecorationBelongService {

	public int approvalForApprovalForCustomerOriginTDecorationBelong(ApprovalPO approvalPO) throws FLException;
	
	public int refuseForApprovalForCustomerOriginTDecorationBelong(ApprovalPO approvalPO) throws FLException;
	
}
