package com.fanglin.payment.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.payment.vo.PaymentActivityVO;
import com.fanglin.utils.Paging;

public interface PaymentActivityService {

	public void pagePaymentActivity(Paging paging, List<Filter> filters);

	public int amountPaymentActivity(PaymentActivityVO paymentActivity);

	public int checkPaymentActivityForDecoration(PaymentActivityVO paymentActivityVO) throws FLException;

	public int checkPaymentActivityForSales(PaymentActivityVO paymentActivityVO) throws FLException;

	public void updatePaymentActivity(PaymentActivityVO paymentActivity) throws FLException;

	public void deletePaymentActivity(PaymentActivityVO paymentActivity) throws FLException;

}
