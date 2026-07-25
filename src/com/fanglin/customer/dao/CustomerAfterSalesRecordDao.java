package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.customer.po.CustomerAfterSalesRecordPO;

public interface CustomerAfterSalesRecordDao extends Dao<CustomerAfterSalesRecordPO> {

	public List<CustomerAfterSalesRecordPO> queryCustomerAfterSalesRecord(long asid);

}
