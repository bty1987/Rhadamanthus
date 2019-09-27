package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.customer.vo.ServicePaymentVO;
import com.fanglin.utils.Paging;

public interface ServicePaymentService {

	public void queryCusServicePayment(Paging paging, List<Filter> filters, ServicePaymentVO servicePaymentVO);

	public long countCusServicePaymentForAmount(ServicePaymentVO servicePaymentVO);

}
