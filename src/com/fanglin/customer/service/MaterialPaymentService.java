package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.customer.vo.MaterialPaymentVO;
import com.fanglin.utils.Paging;

public interface MaterialPaymentService {

	public void queryCusMaterialPayment(Paging paging, List<Filter> filters, MaterialPaymentVO materialPaymentVO);
	
	public float countCusMaterialPaymentForAmount(MaterialPaymentVO materialPaymentVO);
	
}
