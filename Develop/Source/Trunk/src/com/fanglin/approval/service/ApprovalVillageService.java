/**
 * @File Name		: ApprovalVillageService.java
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
import com.fanglin.approval.vo.ApprovalVillageVO;
import com.fanglin.core.interceptor.FLException;

public interface ApprovalVillageService {
	
	public int submitApprovalForVillage(ApprovalVO approvalVO, ApprovalVillageVO approvalVillageVO, String userId) throws FLException;
	
	public int approvalForVillage(ApprovalPO approvalPO) throws FLException;

}
