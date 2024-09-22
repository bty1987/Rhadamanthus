package com.fanglin.data.common.service;

import java.util.List;

import com.fanglin.data.common.vo.PaymentScaleItemVO;
import com.fanglin.data.common.vo.PaymentScaleVO;

public interface PaymentScaleItemService {

	public List<PaymentScaleItemVO> queryPaymentScaleItemByPsid(PaymentScaleItemVO paymentScaleItemVO);

	public List<PaymentScaleItemVO> fetchPaymentScaleItem(PaymentScaleVO paymentScaleVO, PaymentScaleItemVO paymentScaleItemVO);

	public PaymentScaleItemVO queryPaymentScaleItem(PaymentScaleVO paymentScaleVO, PaymentScaleItemVO paymentScaleItemVO);

	public void addPaymentScaleItem(PaymentScaleItemVO paymentScaleItemVO);

	public void deletePaymentScaleItem(PaymentScaleItemVO paymentScaleItemVO);
}
