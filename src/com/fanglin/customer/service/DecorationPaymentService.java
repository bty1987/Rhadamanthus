package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.customer.vo.DecorationPaymentVO;
import com.fanglin.utils.Paging;

public interface DecorationPaymentService {
	
	public void queryCusDecorationPayment(Paging paging, List<Filter> filters, DecorationPaymentVO decorationPaymentVO);
	
	public List<DecorationPaymentVO> countCusDecorationPaymentForAmount(DecorationPaymentVO decorationPaymentVO);

}
