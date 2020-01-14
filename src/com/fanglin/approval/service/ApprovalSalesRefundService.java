package com.fanglin.approval.service;

import java.util.List;

import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.approval.vo.ApprovalSalesRefundItemVO;
import com.fanglin.approval.vo.ApprovalSalesRefundVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.interceptor.FLException;

public interface ApprovalSalesRefundService {

	public List<ApprovalSalesRefundItemVO> queryApprovalSalesRefundItem(ApprovalVO approvalVO) throws FLException;

	public int submitApprovalForSalesRefund(ApprovalVO approvalVO, ApprovalSalesRefundVO approvalSalesRefundVO, List<ApprovalSalesRefundItemVO> approvalSalesRefundItemVOs, String userId, int company) throws FLException;

	public int approveForSalesRefund(ApprovalPO approvalPO) throws FLException;

	public int refuseForSalesRefund(ApprovalPO approvalPO) throws FLException;

}
