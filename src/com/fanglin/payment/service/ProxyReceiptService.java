package com.fanglin.payment.service;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.payment.vo.ProxyReceiptVO;

public interface ProxyReceiptService {

	public ProxyReceiptVO queryProxyReceiptByPrId(ProxyReceiptVO proxyReceipt) throws FLException;

}
