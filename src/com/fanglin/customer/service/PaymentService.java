package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.customer.vo.PaymentVO;
import com.fanglin.utils.Paging;

public interface PaymentService {
	
	public void queryCusPayment(Paging paging, List<Filter> filters, PaymentVO paymentVO,String unionId);
	
}
