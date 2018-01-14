/**
 * @File Name		: ApprovalDecorationActivityService.java
 * @Package   	: com.fanglin.approval.service
 * @Version		: 1.0
 * @Date			: 2015-11-13
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.approval.service;

import java.util.List;

import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.approval.vo.ApprovalDecorationActivityItemVO;
import com.fanglin.approval.vo.ApprovalDecorationActivityVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.interceptor.FLException;

public interface ApprovalDecorationActivityService {
	
	public int submitApprovalForDecorationActivity(ApprovalVO approvalVO, ApprovalDecorationActivityVO approvalDecorationActivityVO, List<ApprovalDecorationActivityItemVO> approvalDecorationActivityItemVOs, String userId,int company) throws FLException;
	
	public int approvalForDecorationActivity(ApprovalPO approvalPO) throws FLException;

}
