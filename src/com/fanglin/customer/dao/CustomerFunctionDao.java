package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.po.CustomerFunctionPO;
import com.fanglin.utils.Paging;

public interface CustomerFunctionDao extends Dao<CustomerFunctionPO> {

	public List<CustomerFunctionPO> pageCustomerFunction(Paging paging, List<Filter> filters);

	public List<CustomerFunctionPO> queryCustomerFunction(Short type);

	public List<CustomerFunctionPO> queryCustomerFunctionByName(String name);

	public long countCustomerFunctionRightByCfid(long cfid);

}
