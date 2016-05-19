/**
 * @File Name		: ApprovalQuotationDiscountService.java
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
import com.fanglin.approval.vo.ApprovalQuotationDiscountVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.interceptor.FLException;

public interface ApprovalQuotationDiscountService {
	
	public int submitApprovalForQuotationDiscount(ApprovalVO approvalVO, ApprovalQuotationDiscountVO approvalQuotationDiscountVO, String userId, short level) throws FLException;
	
	public int approvalForQuotationDiscount(ApprovalPO approvalPO) throws FLException;

}
