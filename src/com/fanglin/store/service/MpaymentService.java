package com.fanglin.store.service;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.store.vo.MpaymentVO;
import com.fanglin.store.vo.MuserVO;

public interface MpaymentService {
	
	public void addMpayment(MpaymentVO mpaymentVO, MuserVO muserVO) throws FLException;
	
}
