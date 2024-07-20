package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.customer.po.CustomerSourceRecordPO;

public interface CustomerSourceRecordDao extends Dao<CustomerSourceRecordPO> {

	public List<CustomerSourceRecordPO> queryCustomerSourceRecord(long csid);

}
