package com.fanglin.customer.service;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.vo.ApprovalVO;

public interface ApprovalService {

	public ApprovalVO queryApproval(ApprovalVO approvalVO);

	public int confirmApproval(ApprovalVO approvalVO) throws FLException;

}
