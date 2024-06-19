package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.po.CustomerChancePO;
import com.fanglin.utils.Paging;

public interface CustomerChanceDao extends Dao<CustomerChancePO> {

	public List<CustomerChancePO> pageCustomerChance(Paging paging, List<Filter> filters);

}
