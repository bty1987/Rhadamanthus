package com.fanglin.right.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.right.po.PaymentFunctionRightPO;

public interface PaymentFunctionRightDao extends Dao<PaymentFunctionRightPO> {
	
	public List<PaymentFunctionRightPO> queryPaymentFunctionRight(String name, Short type);

	public int deletePaymentFunctionRightByName(String name, Short type);

}
