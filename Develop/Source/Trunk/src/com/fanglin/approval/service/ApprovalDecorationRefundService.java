/**
 * @File Name		: ApprovalDecorationRefundService.java
 * @Package   	: com.fanglin.approval.service
 * @Version		: 1.0
 * @Date			: 2015-11-13
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.approval.service;

import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.approval.vo.ApprovalDecorationRefundVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.interceptor.FLException;

public interface ApprovalDecorationRefundService {
	
	public int submitApprovalForDecorationRefund(ApprovalVO approvalVO, ApprovalDecorationRefundVO approvalDecorationRefundVO, String userId) throws FLException;
	
	public int approvalForDecorationRefund(ApprovalPO approvalPO) throws FLException;
	
	public int refuseForDecorationRefund(ApprovalPO approvalPO) throws FLException;

}
