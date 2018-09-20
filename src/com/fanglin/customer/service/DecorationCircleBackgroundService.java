package com.fanglin.customer.service;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.vo.DecorationCircleBackgroundVO;

public interface DecorationCircleBackgroundService {
	
	public DecorationCircleBackgroundVO queryDecorationCircleBackgroundByUnionId(DecorationCircleBackgroundVO decorationCircleBackgroundVO);

	public int updateDecorationCircleBackground(DecorationCircleBackgroundVO decorationCircleBackgroundVO) throws FLException;
	
}
