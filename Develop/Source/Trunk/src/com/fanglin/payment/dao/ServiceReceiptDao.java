package com.fanglin.payment.dao;

import com.fanglin.core.dao.Dao;
import com.fanglin.payment.po.ServiceReceiptPO;

public interface ServiceReceiptDao  extends Dao<ServiceReceiptPO>{

	public ServiceReceiptPO queryServiceReceiptBySrId(long srId);
	
}
