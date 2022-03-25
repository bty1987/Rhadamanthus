package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.customer.po.CustomerOriginFunctionPO;

public interface CustomerOriginFunctionDao extends Dao<CustomerOriginFunctionPO> {

	public List<CustomerOriginFunctionPO> queryCustomerOriginFunction(Short type);

}
