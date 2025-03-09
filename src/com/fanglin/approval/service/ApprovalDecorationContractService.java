package com.fanglin.approval.service;

import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.approval.vo.ApprovalDecorationContractVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.interceptor.FLException;

public interface ApprovalDecorationContractService {

	public int submitApprovalForDecorationContract(ApprovalVO approvalVO, ApprovalDecorationContractVO approvalDecorationContractVO, String userId, int company, String code, String forms) throws FLException;

	public int approveForDecorationContract(ApprovalPO approvalPO) throws FLException;

}
