package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.customer.po.CustomerFunctionPO;

public interface CustomerFunctionDao extends Dao<CustomerFunctionPO> {

	public List<CustomerFunctionPO> queryCustomerFunction(Short type);

}
