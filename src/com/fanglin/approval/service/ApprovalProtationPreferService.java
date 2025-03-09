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

import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.approval.vo.ApprovalProtationPreferVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.quotation.vo.ProtationVO;

public interface ApprovalProtationPreferService {

	public int submitApprovalForProtationPrefer(ApprovalVO approvalVO, ApprovalProtationPreferVO approvalProtationPreferVO, ProtationVO protationVO, String userId, int company, String code, String forms) throws FLException;

	public int approveForProtationPrefer(ApprovalPO approvalPO) throws FLException;

}
