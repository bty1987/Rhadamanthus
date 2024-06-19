package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.po.CustomerUserRulePO;
import com.fanglin.utils.Paging;

public interface CustomerUserRuleDao extends Dao<CustomerUserRulePO> {

	public List<CustomerUserRulePO> pageCustomerUserRule(Paging paging, List<Filter> filters, int company);

}
