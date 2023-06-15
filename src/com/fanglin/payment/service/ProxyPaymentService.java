package com.fanglin.payment.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.payment.vo.ProxyPaymentVO;
import com.fanglin.payment.vo.ProxyReceiptVO;
import com.fanglin.utils.Paging;

public interface ProxyPaymentService {

	public void pageProxyPayment(Paging paging, List<Filter> filters, ProxyPaymentVO proxyPayment, int company);

	public ProxyPaymentVO queryProxyPayment(ProxyPaymentVO proxyPayment) throws FLException;

	public void addProxyPayment(ProxyPaymentVO proxyPayment, String userId, int company);

	public void collectProxyPayment(ProxyPaymentVO proxyPayment, ProxyReceiptVO proxyReceipt, List<Long> ptids, String userId, int company) throws FLException;

	public void refundProxyPayment(ProxyPaymentVO proxyPayment, String userId, int company) throws FLException;

	public void confirmProxyPayment(List<Long> ppids, String userId) throws FLException;

	public void cancelProxyPayment(ProxyPaymentVO proxyPayment) throws FLException;

}
