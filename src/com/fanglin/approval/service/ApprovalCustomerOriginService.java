/**
 * @File Name		: ApprovalCustomerOriginService.java
 * @Package   	: com.fanglin.approval.service
 * @Version		: 1.0
 * @Date			: 2019-10-12
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.approval.service;

import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.approval.vo.ApprovalCustomerOriginVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.interceptor.FLException;

public interface ApprovalCustomerOriginService {

	public ApprovalCustomerOriginVO queryApprovalCustomerOrigin(ApprovalVO approvalVO) throws FLException;

	public int submitApprovalForCustomerOrigin(ApprovalVO approvalVO, ApprovalCustomerOriginVO approvalCustomerOriginVO, String userId, int company) throws FLException;

	public int approveForCustomerOrigin(ApprovalPO approvalPO) throws FLException;

	public int refuseForCustomerOrigin(ApprovalPO approvalPO) throws FLException;

}
