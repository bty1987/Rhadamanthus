/**
 * Title: PaymentService
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */

package com.fanglin.payment.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.payment.vo.PaymentVO;
import com.fanglin.utils.Paging;

public interface PaymentService {

	public void pagePaymentForHistory(Paging paging, List<Filter> filters);
	
	public List<PaymentVO> queryPaymentByOrderId(PaymentVO paymentVO);
	
	public PaymentVO queryPaymentByPaymentId(PaymentVO paymentVO, String userId) throws FLException;
	
	public int collectPayment(PaymentVO paymentVO, String userId) throws FLException;

	public int confirmPayment(List<Integer> paymentIds, String userId)  throws FLException;
	
	public int updatePayment(PaymentVO paymentVO);
	
	public int payPayment(PaymentVO paymentVO, String userId) throws FLException;
	
	public int withdrawPayment(PaymentVO paymentVO, String userId) throws FLException;
	
	public int convertPayment(PaymentVO paymentVO, String convertLeftType, String convertRightType, float convertCash, String operatorId) throws FLException;
	
}
