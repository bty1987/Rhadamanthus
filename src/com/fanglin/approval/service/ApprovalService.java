/**
 * @File Name		: ApprovalService.java
 * @Package   	: com.fanglin.approval.service
 * @Version		: 1.0
 * @Date			: 2015-10-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.approval.service;

import java.util.List;

import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface ApprovalService {
	
	public void pageApprovalForReceive(Paging paging, List<Filter> filters, String userId, int company);
	
	public void pageApprovalForSend(Paging paging, List<Filter> filters, String userId, int company);
	
	public void pageApprovalForReceiveDept(Paging paging, List<Filter> filters, String userId, int company);

	public ApprovalVO queryApprovalByAId(ApprovalVO approvalVO) throws FLException;
	
	public ApprovalPO approve(ApprovalPO approvalPO) throws FLException;
	
	public int approve(ApprovalVO approvalVO) throws FLException;
	
	public int approvalCallback(ApprovalVO approvalVO) throws FLException;
	
	public int refuse(ApprovalVO approvalVO) throws FLException;

}
