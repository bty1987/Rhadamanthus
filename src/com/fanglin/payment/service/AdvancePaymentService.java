/**
 * @File Name		: AdvancePaymentService.java
 * @Package   	: com.fanglin.finance.service
 * @Version		: 1.0
 * @Date			: 2015-9-15
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.payment.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.payment.vo.AdvancePaymentVO;
import com.fanglin.payment.vo.PaymentVO;
import com.fanglin.utils.Paging;

public interface AdvancePaymentService {
	
	public void pageAdvancePayment(Paging paging, List<Filter> filters, int company);
	
	public List<Long> queryAdvancePaymentByOrderId(AdvancePaymentVO advancePaymentVO) throws FLException;
	
	public int updateAdvancePayment(PaymentVO paymentVO, int company) throws FLException;
	
}
