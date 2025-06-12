package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.po.CustomerProfilePO;
import com.fanglin.utils.Paging;

public interface CustomerProfileDao extends Dao<CustomerProfilePO> {

	public List<CustomerProfilePO> pageCustomerProfile(Paging paging, List<Filter> filters, int company);

	public List<CustomerProfilePO> queryCustomerProfileByCsid(long csid, Short type);

	public List<CustomerProfilePO> queryCustomerProfileByCid(long cid, Short type);

	public List<CustomerProfilePO> queryCustomerProfileByOrderId(String orderId, Short type);

	public int updateCustomerProfile(String orderId, long cid, long csid);

}
