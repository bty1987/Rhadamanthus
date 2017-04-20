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
import com.fanglin.data.common.vo.CustomerVO;
import com.fanglin.payment.vo.PaymentVO;

public interface AdvancePaymentService {
	
	public List<Float> queryAdvancePaymentByCustomerId(CustomerVO customerVO);
	
	public int updateAdvancePayment(PaymentVO paymentVO) throws FLException;
	
}
