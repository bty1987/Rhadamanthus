package com.fanglin.right.service;

import java.util.List;

import com.fanglin.right.vo.PaymentFunctionRightVO;

public interface PaymentFunctionRightService {
	
	public List<PaymentFunctionRightVO> queryPaymentFunctionRight(PaymentFunctionRightVO paymentFunctionRight);

	public void updatePaymentFunctionRight(PaymentFunctionRightVO paymentFunctionRight, List<Long> pfids, int queryCompany);

}
