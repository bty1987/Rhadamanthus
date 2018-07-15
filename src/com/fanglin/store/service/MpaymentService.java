package com.fanglin.store.service;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.store.vo.MpaymentVO;

public interface MpaymentService {
	
	public void addMpayment(MpaymentVO mpaymentVO) throws FLException;
	
}
