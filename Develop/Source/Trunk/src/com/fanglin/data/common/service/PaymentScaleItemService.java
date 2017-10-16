package com.fanglin.data.common.service;

import java.util.List;

import com.fanglin.data.common.vo.PaymentScaleItemVO;

public interface PaymentScaleItemService {
	
	public List<PaymentScaleItemVO> queryPaymentScaleItemByPsid (PaymentScaleItemVO paymentScaleitem);
	
	public void addPaymentScaleItem (PaymentScaleItemVO paymentScaleitem);
	
	public void deletePaymentScaleItem (PaymentScaleItemVO paymentScaleitem);
}
