package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.customer.po.CustomerRecordPO;

public interface CustomerRecordDao extends Dao<CustomerRecordPO> {

	public List<CustomerRecordPO> queryCustomerRecord(long csid);

}
