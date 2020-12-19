package com.fanglin.payment.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.payment.po.PaymentFunctionPO;

public interface PaymentFunctionDao extends Dao<PaymentFunctionPO> {

	public List<PaymentFunctionPO> queryPaymentFunction(Short type);
	
}
