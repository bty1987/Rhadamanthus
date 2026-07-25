package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.customer.po.CustomerAfterSalesRefPO;

public interface CustomerAfterSalesRefDao extends Dao<CustomerAfterSalesRefPO> {

	public List<CustomerAfterSalesRefPO> queryCustomerAfterSalesRef(long asid);

	public CustomerAfterSalesRefPO queryCustomerAfterSalesRef(short type, long refId);

}
