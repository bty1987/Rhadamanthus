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

import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.utils.Paging;

public interface ApprovalService {
	
	public void pageApprovalByReceiveId(Paging paging, List<FilterVO> filters, String userId);
	
	public ApprovalVO queryApprovalByAId(ApprovalVO approvalVO) throws FLException;
	
	public int approve(ApprovalVO approvalVO) throws FLException;
	
	public int refuse(ApprovalVO approvalVO) throws FLException;

}
