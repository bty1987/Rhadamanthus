package com.fanglin.customer.service;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.vo.ProxyPaymentVO;

public interface ProxyPaymentService {

	public ProxyPaymentVO queryCusProxyPayment(ProxyPaymentVO proxyPaymentVO) throws FLException;

}
