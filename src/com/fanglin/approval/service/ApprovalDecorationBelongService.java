/**
 * @File Name		: ApprovalDecorationBelongService.java
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
import com.fanglin.approval.vo.ApprovalDecorationBelongItemVO;
import com.fanglin.approval.vo.ApprovalDecorationBelongVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.interceptor.FLException;

public interface ApprovalDecorationBelongService {

	public int submitApprovalForDecorationBelong(ApprovalVO approvalVO, ApprovalDecorationBelongVO approvalDecorationBelongVO, List<ApprovalDecorationBelongItemVO> approvalDecorationBelongItemVOs, String userId, int company) throws FLException;

	public int approveForDecorationBelong(ApprovalPO approvalPO) throws FLException;

	public int confirmForDecorationBelong(ApprovalPO approvalPO) throws FLException;

}
