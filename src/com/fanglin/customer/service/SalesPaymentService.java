package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.customer.vo.SalesPaymentVO;
import com.fanglin.utils.Paging;

public interface SalesPaymentService {
	
	public void queryCusSalesPayment(Paging paging, List<Filter> filters, SalesPaymentVO salesPaymentVO);
	
	public Float countCusSalesPaymentForAmount(SalesPaymentVO salesPaymentVO);
	
}
