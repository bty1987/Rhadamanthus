/**
 * @File Name		: ApprovalActivityService.java
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
import com.fanglin.approval.vo.ApprovalActivityItemVO;
import com.fanglin.approval.vo.ApprovalActivityVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.interceptor.FLException;

public interface ApprovalActivityService {
	
	public int submitApprovalForDecorationActivity(ApprovalVO approvalVO, ApprovalActivityVO approvalActivityVO, List<ApprovalActivityItemVO> approvalActivityItemVOs, String userId) throws FLException;
	
	public int approvalForDecorationActivity(ApprovalPO approvalPO) throws FLException;

}
