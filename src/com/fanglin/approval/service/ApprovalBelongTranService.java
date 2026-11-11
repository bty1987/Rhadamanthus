/**
 * @File Name		: ApprovalBelongTranService.java
 * @Package   	: com.fanglin.approval.service
 * @Version		: 1.0
 * @Date			: 2026-11-11
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 人员离职归属移交审批
 */

package com.fanglin.approval.service;

import java.util.List;

import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.approval.vo.ApprovalBelongTranItemVO;
import com.fanglin.approval.vo.ApprovalBelongTranVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.interceptor.FLException;

public interface ApprovalBelongTranService {

	public int submitApprovalForBelongTran(ApprovalVO approvalVO, ApprovalBelongTranVO approvalBelongTranVO, List<ApprovalBelongTranItemVO> approvalBelongTranItemVOs, String userId, int company) throws FLException;

	public int approveForBelongTran(ApprovalPO approvalPO) throws FLException;

	public ApprovalBelongTranVO queryApprovalBelongTranByAId(long aId) throws FLException;

	public List<ApprovalBelongTranItemVO> queryApprovalBelongTranItemByAId(long aId) throws FLException;

}
