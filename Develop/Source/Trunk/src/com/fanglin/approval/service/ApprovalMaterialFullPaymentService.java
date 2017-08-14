/**
 * @File Name		: ApprovalMaterialFullPaymentService.java
 * @Package   	: com.fanglin.approval.service
 * @Version		: 1.0
 * @Date			: 2015-11-16
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.approval.service;

import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.approval.vo.ApprovalMaterialFullPaymentVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.interceptor.FLException;

public interface ApprovalMaterialFullPaymentService {
	
	public int submitApprovalForDecorationRefund(ApprovalVO approvalVO, ApprovalMaterialFullPaymentVO approvalMaterialFullPaymentVO, String userId, int company) throws FLException;
	
	public int approvalForMaterialFullPayment(ApprovalPO approvalPO) throws FLException;
	
	public int refuseForMaterialFullPayment(ApprovalPO approvalPO) throws FLException;

}
