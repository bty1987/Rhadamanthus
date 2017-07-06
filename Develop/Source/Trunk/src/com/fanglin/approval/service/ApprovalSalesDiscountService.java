package com.fanglin.approval.service;


import com.fanglin.approval.po.ApprovalPO;

import com.fanglin.approval.vo.ApprovalSalesDiscountVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.interceptor.FLException;

public interface ApprovalSalesDiscountService {

	public int submitApprovalSalesDiscount(ApprovalVO approvalVO,ApprovalSalesDiscountVO approvalSalesDiscountVO,String userId) throws FLException;
	
	public int approvalForSalesDiscount(ApprovalPO approvalPO) throws FLException;
	
}
