package com.fanglin.payment.service;

import java.util.List;

import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.vo.SignetVO;
import com.fanglin.payment.vo.PaymentContractVO;
import com.fanglin.utils.Paging;

public interface PaymentContractService {

	public void pagePaymentContract(Paging paging, List<Filter> filters);

	public PaymentContractVO queryPaymentContract(PaymentContractVO paymentContract) throws FLException;

	public void sendPaymentContractForAuth(PaymentContractVO paymentContractVO) throws FLException;

	public void sendPaymentContract(PaymentContractVO paymentContractVO) throws FLException;

	public String redirectPaymentContract(PaymentContractVO paymentContractVO) throws FLException;

	public String viewPaymentContract(PaymentContractVO paymentContractVO) throws FLException;

	public String signPaymentContractForCompany(SignetVO signetVO, PaymentContractVO paymentContractVO) throws FLException;

	public String signPaymentContractForCustomer(PaymentContractVO paymentContractVO, CustomerVO customerVO) throws FLException;

	public PaymentContractVO addPaymentContract(PaymentContractVO paymentContract, String userId) throws FLException;

	public int affixPaymentContract(PaymentContractVO paymentContractVO, String userId) throws FLException;

	public int expirePaymentContract(PaymentContractVO paymentContractVO) throws FLException;

	public int filingPaymentContract(PaymentContractVO paymentContractVO, String userId) throws FLException;

}
