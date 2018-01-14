/**
 * @File Name		: AprovalDecorationHouseService.java
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
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.approval.vo.ApprovalDecorationHouseVO;
import com.fanglin.core.interceptor.FLException;

public interface ApprovalDecorationHouseService {
	
	public int submitApprovalDecorationHouse(ApprovalVO approvalVO, ApprovalDecorationHouseVO aprovalDecorationHouseVO, String userId, int company) throws FLException;
	
	public int approvalDecorationHouse(ApprovalPO approvalPO) throws FLException;

}
