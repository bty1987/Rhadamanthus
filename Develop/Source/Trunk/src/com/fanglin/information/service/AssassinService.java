package com.fanglin.information.service;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.payment.vo.PaymentVO;

public interface AssassinService {

	public int PayPayment(PaymentVO payment, String userId) throws FLException;
	
}
