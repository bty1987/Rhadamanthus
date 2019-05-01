/**
 * @File Name		: ApprovalCommonServiceImpl.java
 * @Package   	: com.fanglin.approval.service.impl
 * @Version		: 1.0
 * @Date			: 2019-4-18
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.approval.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONArray;
import com.fanglin.approval.service.ApprovalCommonService;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.dingding.service.ApprovalService;


@Service("approvalCommonService")
public class ApprovalCommonServiceImpl implements ApprovalCommonService {
	
	@Autowired
	private ApprovalService approvalDDService;

	@Override
	public int submitApprovalForDing(String code, String forms, String userId, int company) throws FLException {
		
		JSONArray form = JSONArray.parseArray(forms);
		
		approvalDDService.initiateApproval(code, userId, null, null, null, form, company);
		
		return 0;
	}

}
