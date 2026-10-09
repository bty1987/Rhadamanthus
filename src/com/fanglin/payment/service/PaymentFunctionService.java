package com.fanglin.payment.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.payment.vo.PaymentFunctionVO;
import com.fanglin.utils.Paging;

public interface PaymentFunctionService {

	public List<PaymentFunctionVO> pagePaymentFunction(Paging paging, List<Filter> filters);

	public List<PaymentFunctionVO> queryPaymentFunction(PaymentFunctionVO paymentFunction);

	public int addPaymentFunction(PaymentFunctionVO paymentFunction) throws FLException;

	public int updatePaymentFunction(PaymentFunctionVO paymentFunction) throws FLException;

	public int deletePaymentFunction(PaymentFunctionVO paymentFunction) throws FLException;

}
