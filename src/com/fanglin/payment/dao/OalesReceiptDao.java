package com.fanglin.payment.dao;

import com.fanglin.core.dao.Dao;
import com.fanglin.payment.po.OalesReceiptPO;

public interface OalesReceiptDao extends Dao<OalesReceiptPO> {

	public OalesReceiptPO queryOalesReceipt(long orid);

}
