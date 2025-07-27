package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.po.CustomerOriginPO;
import com.fanglin.utils.Paging;

public interface CustomerOriginDao extends Dao<CustomerOriginPO> {

	public List<CustomerOriginPO> pageCustomerOrigin(Paging paging, List<Filter> filters, List<Integer> dids);

	public CustomerOriginPO queryCustomerOrigin(String orderId);

}
