package com.fanglin.payment.dao;

import com.fanglin.core.dao.Dao;
import com.fanglin.payment.po.SalesReceiptPO;

public interface SalesReceiptDao  extends Dao<SalesReceiptPO> {

	public SalesReceiptPO querySalesReceiptBySrId(long srId);
	
}
