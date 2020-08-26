package com.fanglin.approval.service;

import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.approval.vo.ApprovalSalesDaymentVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.interceptor.FLException;

public interface ApprovalSalesDaymentService {

	public int submitApprovalForSalesDayment(ApprovalVO approvalVO, ApprovalSalesDaymentVO approvalSalesDaymentVO, String userId, int company) throws FLException;

	public int approveForSalesDayment(ApprovalPO approvalPO) throws FLException;

}
