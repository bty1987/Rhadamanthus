package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.customer.po.CustomerOriginRecordPO;

public interface CustomerOriginRecordDao extends Dao<CustomerOriginRecordPO> {

	public List<CustomerOriginRecordPO> queryCustomerOriginRecord(long csid);

}
