package com.fanglin.approval.service;

import com.fanglin.core.interceptor.FLException;

public interface ApprovalCurrentService {

	public int submitApprovalForAddReduce(String sender, String code, String forms, String rule, int company) throws FLException;

	public int submitApprovalForPosition(String userId, String code, String forms, String rule, String comment, int company) throws FLException;

}
