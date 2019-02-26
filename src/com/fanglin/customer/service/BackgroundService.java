package com.fanglin.customer.service;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.vo.BackgroundVO;

public interface BackgroundService {
	
	public BackgroundVO queryBackground(BackgroundVO backgroundVO);

	public int updateBackground(BackgroundVO backgroundVO) throws FLException;
	
}
