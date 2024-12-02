package com.fanglin.approval.service;

import java.util.List;

import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.approval.vo.ApprovalCustomerOriginTDecorationVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface ApprovalCustomerOriginTDecorationService {
	
	public void pageApprovalCustomerOriginTDecoration(Paging paging, List<Filter> filters, int company) throws FLException;       

	public ApprovalCustomerOriginTDecorationVO queryApprovalCustomerOriginTDecoration(ApprovalVO approvalVO) throws FLException;

	public int submitApprovalForCustomerOriginTDecoration(ApprovalVO approvalVO, ApprovalCustomerOriginTDecorationVO approvalCustomerOriginTDecorationVO, String userId, int company) throws FLException;

	public int approveForCustomerOriginTDecoration(ApprovalPO approvalPO) throws FLException;

	public int refuseForCustomerOriginTDecoration(ApprovalPO approvalPO) throws FLException;

	   
	


}
