package com.fanglin.approval.service;

import java.util.Map;

import com.fanglin.core.interceptor.FLException;

public interface ApprovalCurrentService {
	
	public int submitApprovalForAddReduce(String sender,Map<String, String> args,int company) throws FLException;
	
	public int submitApprovalForResignation(String sender,Map<String, String> args,int company) throws FLException;

}
