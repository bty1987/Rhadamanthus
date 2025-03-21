package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.customer.po.CustomerUserRuleItemPO;

public interface CustomerUserRuleItemDao extends Dao<CustomerUserRuleItemPO> {

	public List<CustomerUserRuleItemPO> queryCustomerUserRuleItem(Long curid);

	public CustomerUserRuleItemPO pullCustomerUserRuleItem(int company);

	public CustomerUserRuleItemPO pullCustomerUserRuleItem(int company, int area, List<Integer> uids, int did);

	public CustomerUserRuleItemPO pullCustomerUserRuleItem(int company, int area, List<Integer> uids);

	public CustomerUserRuleItemPO pullCustomerUserRuleItem(int company, List<Integer> uids, int did, int area);

	public int existCustomerUserRuleItem(int company, int area);

}
