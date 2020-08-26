package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.vo.ComplackVO;

public interface ComplackService {
	
	public List<ComplackVO> queryComplack(ComplackVO complack);
	
	public int trackComplack(ComplackVO Complack, String userId) throws FLException;

}
