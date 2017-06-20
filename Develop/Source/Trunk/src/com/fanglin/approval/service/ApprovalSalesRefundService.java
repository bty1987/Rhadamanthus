package com.fanglin.approval.service;

import java.util.List;


import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.approval.vo.ApprovalSalesRefundItemVO;
import com.fanglin.approval.vo.ApprovalSalesRefundVO;

public interface ApprovalSalesRefundService {

	public List<ApprovalSalesRefundItemVO> queryApprovalSalesRefundItem(ApprovalVO approvalVO) throws FLException;

	public int submitApprovalForSalesRefund(ApprovalVO approvalVO,ApprovalSalesRefundVO approvalSalesRefundVO,List<ApprovalSalesRefundItemVO> approvalSalesRefundItemVOs,String userId) throws FLException;
	
	public int approvalForSalesRefund(ApprovalPO approvalPO) throws FLException;
	
	public int refuseForSalesRefund(ApprovalPO approvalPO) throws FLException;

}
