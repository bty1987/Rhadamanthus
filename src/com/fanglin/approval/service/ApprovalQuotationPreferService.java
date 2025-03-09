package com.fanglin.approval.service;

import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.approval.vo.ApprovalQuotationPreferVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.interceptor.FLException;

public interface ApprovalQuotationPreferService {

	public int submitApprovalForQuotationPrefer(ApprovalVO approvalVO, ApprovalQuotationPreferVO approvalQuotationPreferVO, String userId, int company, String code, String forms) throws FLException;

	public int approveForQuotationPrefer(ApprovalPO approvalPO) throws FLException;
}
