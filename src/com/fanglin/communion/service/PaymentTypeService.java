package com.fanglin.communion.service;

import java.util.List;

import com.fanglin.communion.vo.PaymentTypeVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface PaymentTypeService {

	public void pagePaymentType(Paging paging, List<Filter> filters);

	public List<PaymentTypeVO> queryPaymentType(PaymentTypeVO paymentType);

	public PaymentTypeVO queryPaymentTypeByPtid(PaymentTypeVO paymentType) throws FLException;

	public void addPaymentType(PaymentTypeVO paymentType) throws FLException;

	public void updatePaymentType(PaymentTypeVO paymentType) throws FLException;

	public void updatePaymentTypeForStatus(PaymentTypeVO paymentType) throws FLException;

}
