/**
 * @File Name		: ApprovalCustomerSourceService.java
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
import com.fanglin.approval.vo.ApprovalCustomerSourceVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.interceptor.FLException;

public interface ApprovalCustomerSourceService {

	public ApprovalCustomerSourceVO queryApprovalCustomerSource(ApprovalVO approvalVO) throws FLException;

	public int submitApprovalForCustomerSource(ApprovalVO approvalVO, ApprovalCustomerSourceVO approvalCustomerSourceVO, String userId, int company) throws FLException;

	public int approveForCustomerSource(ApprovalPO approvalPO) throws FLException;

	public int refuseForCustomerSource(ApprovalPO approvalPO) throws FLException;

}
