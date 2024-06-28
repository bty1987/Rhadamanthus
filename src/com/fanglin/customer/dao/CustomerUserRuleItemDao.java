package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.customer.po.CustomerUserRuleItemPO;

public interface CustomerUserRuleItemDao extends Dao<CustomerUserRuleItemPO> {

	public List<CustomerUserRuleItemPO> queryCustomerUserRuleItem(Long curid);

}
