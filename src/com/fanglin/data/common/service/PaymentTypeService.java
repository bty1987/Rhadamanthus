package com.fanglin.data.common.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.vo.PaymentTypeVO;
import com.fanglin.utils.Paging;

public interface PaymentTypeService {

	public void pagePaymentType(Paging paging, List<Filter> filters, int company);

	public List<PaymentTypeVO> queryPaymentType(PaymentTypeVO paymentType, int company);

	public PaymentTypeVO queryPaymentTypeByPtid(PaymentTypeVO paymentType) throws FLException;

	public PaymentTypeVO queryPaymentTypeByName(PaymentTypeVO paymentType, int company) throws FLException;

	public void addPaymentType(PaymentTypeVO paymentType, int company) throws FLException;

	public void updatePaymentType(PaymentTypeVO paymentType) throws FLException;

	public void updatePaymentTypeForStatus(PaymentTypeVO paymentType) throws FLException;

}
