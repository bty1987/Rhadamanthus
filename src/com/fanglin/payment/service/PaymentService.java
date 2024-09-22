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

	public void pagePayment(Paging paging, List<Filter> filters, PaymentVO payment, int company) throws FLException;

	public List<PaymentVO> queryPaymentByOrderId(PaymentVO paymentVO);

	public PaymentVO queryPaymentByPaymentId(PaymentVO paymentVO) throws FLException;

	public PaymentVO queryPaymentByArid(PaymentVO payment) throws FLException;

	public int collectPayment(PaymentVO paymentVO, String userId, List<Long> ptids) throws FLException;

	public int confirmPayment(List<Long> pids, String userId) throws FLException;

	public int withdrawPayment(PaymentVO paymentVO, String userId) throws FLException;

	public int payPayment(PaymentVO paymentVO, String userId) throws FLException;

	public int returnPayment(PaymentVO paymentVO, String userId) throws FLException;

	public void addPayment(PaymentVO paymentVO, String userId) throws FLException;

	public int updatePayment(PaymentVO paymentVO) throws FLException;

	public void sendPayment(PaymentVO payment) throws FLException;

}
