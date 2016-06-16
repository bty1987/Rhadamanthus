/**
 * @File Name		: ApprovalMaterialRefundService.java
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
import com.fanglin.approval.vo.ApprovalMaterialRefundItemVO;
import com.fanglin.approval.vo.ApprovalMaterialRefundVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.interceptor.FLException;

public interface ApprovalMaterialRefundService {
	
	public int submitApprovalForMaterialRefund(ApprovalVO approvalVO, ApprovalMaterialRefundVO approvalMaterialRefundVO, List<ApprovalMaterialRefundItemVO> approvalMaterialRefundItemVOs, String userId) throws FLException;
	
	public int approvalForMaterialRefund(ApprovalPO approvalPO) throws FLException;
	
	public int refuseForMaterialRefund(ApprovalPO approvalPO) throws FLException;

}
