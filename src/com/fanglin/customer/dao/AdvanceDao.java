package com.fanglin.customer.dao;

import com.fanglin.core.dao.Dao;
import com.fanglin.payment.po.AdvancePaymentPO;

public interface AdvanceDao extends Dao<AdvancePaymentPO> {
	
	public AdvancePaymentPO queryCusAdvance(long customerId,int company);
	
}
