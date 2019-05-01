/**
 * @File Name		: ApprovalService.java
 * @Package   	: com.fanglin.approval.service
 * @Version		: 1.0
 * @Date			: 2015-10-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.approval.service;

import com.fanglin.core.interceptor.FLException;

public interface ApprovalCommonService {
	
	public int submitApprovalForDing(String code, String forms, String userId, int company) throws FLException;
	
}
