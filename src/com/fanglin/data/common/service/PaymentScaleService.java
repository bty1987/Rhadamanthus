package com.fanglin.data.common.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.vo.PaymentScaleVO;

public interface PaymentScaleService {

	public List<PaymentScaleVO> queryPaymentScale(PaymentScaleVO paymentScaleVO, int company) throws FLException;

	public void addPaymentScale(PaymentScaleVO paymentScaleVO, int company) throws FLException;

	public void updatePaymentScaleForStatus(PaymentScaleVO paymentScaleVO) throws FLException;

	public void deletePaymentScale(PaymentScaleVO paymentScaleVO);

}
