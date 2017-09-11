package com.fanglin.data.common.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.vo.PaymentScaleVO;

public interface PaymentScaleService  {
	
	public List<PaymentScaleVO> queryPaymentScaleByCid(PaymentScaleVO paymentScale) throws FLException;
	
	public void addPaymentScale(PaymentScaleVO paymentScale) throws FLException;
	
	public void  deletePaymentScale(PaymentScaleVO paymentScale);
	
}
