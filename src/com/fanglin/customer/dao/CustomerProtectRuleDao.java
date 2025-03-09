package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.po.CustomerProtectRulePO;
import com.fanglin.utils.Paging;

public interface CustomerProtectRuleDao extends Dao<CustomerProtectRulePO> {

	public List<CustomerProtectRulePO> pageCustomerProtectRule(Paging paging, List<Filter> filters, int company);

	public List<CustomerProtectRulePO> queryCustomerProtectRule(Short type, Integer value, Integer days);

	public CustomerProtectRulePO queryCustomerProtectRule(Short type, Integer value);

}
