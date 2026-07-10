package com.fanglin.right.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.right.po.CustomerOriginFunctionRightPO;

public interface CustomerOriginFunctionRightDao extends Dao<CustomerOriginFunctionRightPO> {

	public List<CustomerOriginFunctionRightPO> queryCustomerOriginFunctionRight(String name, Integer company);

	public int deleteCustomerOriginFunctionRightByName(String name, Integer company);

}
