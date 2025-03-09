package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.po.CustomerSourcePO;
import com.fanglin.utils.Paging;

public interface CustomerSourceDao extends Dao<CustomerSourcePO> {

	public List<CustomerSourcePO> pageCustomerSource(Paging paging, List<Filter> filters, int company);

	public CustomerSourcePO queryCustomerSource(int uid, String phone, int company);

	public Integer countCustomerSource(int uid, String phone, int company);

	public CustomerSourcePO countCustomerByHouseNumber(String houseNumber, long vid);

}
