package com.fanglin.approval.service;

import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.approval.vo.ApprovalPaymentWithdrawVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.interceptor.FLException;

public interface ApprovalPaymentWithdrawService {

	public int submitApprovalForPaymentWithdraw(ApprovalVO approvalVO, ApprovalPaymentWithdrawVO approvalPaymentWithdrawVO, String userId, int company, String code, String forms) throws FLException;

	public int approveForPaymentWithdraw(ApprovalPO approvalPO) throws FLException;

	public int refuseForPaymentWithdraw(ApprovalPO approvalPO) throws FLException;

}
