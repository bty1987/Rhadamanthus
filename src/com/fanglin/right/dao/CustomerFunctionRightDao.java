package com.fanglin.right.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.right.po.CustomerFunctionRightPO;

public interface CustomerFunctionRightDao extends Dao<CustomerFunctionRightPO> {

	public List<CustomerFunctionRightPO> queryCustomerFunctionRight(String name, Integer company);

	public void syncCustomerFunctionRight(String name, List<Integer> cids, Integer company);

	public int deleteCustomerFunctionRightByName(String name, Integer company);

	public int deleteCustomerFunctionRight(String name, List<Integer> cids);

}
