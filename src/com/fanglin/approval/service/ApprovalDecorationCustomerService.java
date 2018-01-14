/**
 * @File Name		: ApprovalDecorationCustomerService.java
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
import com.fanglin.approval.vo.ApprovalDecorationCustomerVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.interceptor.FLException;

public interface ApprovalDecorationCustomerService {
	
	public int submitApprovalForCustomer(ApprovalVO approvalVO, ApprovalDecorationCustomerVO approvalDecorationCustomerVO, String userId,int company) throws FLException;
	
	public int approvalForCustomer(ApprovalPO approvalPO) throws FLException;

}
