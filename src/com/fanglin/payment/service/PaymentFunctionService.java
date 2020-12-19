package com.fanglin.payment.service;

import java.util.List;

import com.fanglin.payment.vo.PaymentFunctionVO;

public interface PaymentFunctionService {

	public List<PaymentFunctionVO> queryPaymentFunction(PaymentFunctionVO paymentFunction);

}
