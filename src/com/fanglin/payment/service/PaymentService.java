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
	
	public void pagePaymentForCollect(Paging paging, List<Filter> filters, int company);

	public void pagePaymentForConfirm(Paging paging, List<Filter> filters, int company);

	public void pagePaymentForHistory(Paging paging, List<Filter> filters, int company);
	
	public List<PaymentVO> queryPaymentByOrderId(PaymentVO paymentVO);
	
	public PaymentVO queryPaymentByPaymentId(PaymentVO paymentVO, String userId) throws FLException;
	
	public int collectPayment(PaymentVO paymentVO, String userId) throws FLException;

	public int confirmPayment(List<Long> pids, String userId)  throws FLException;
	
	public int withdrawPayment(PaymentVO paymentVO, String userId) throws FLException;
	
	public int payPayment(PaymentVO paymentVO, String userId) throws FLException;
	
	public int updatePayment(PaymentVO paymentVO) throws FLException;

}
