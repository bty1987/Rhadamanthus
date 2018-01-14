package com.fanglin.payment.service;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.payment.vo.ServiceReceiptVO;

public interface ServiceReceiptService {

	public ServiceReceiptVO queryServiceReceiptBySrId(ServiceReceiptVO serviceReceiptVO) throws FLException;
	
}
