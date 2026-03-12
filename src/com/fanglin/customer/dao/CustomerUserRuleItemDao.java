package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.customer.po.CustomerUserRuleItemPO;

public interface CustomerUserRuleItemDao extends Dao<CustomerUserRuleItemPO> {

	public List<CustomerUserRuleItemPO> queryCustomerUserRuleItem(Long curid);

	public CustomerUserRuleItemPO pullCustomerUserRuleItem(int company);

	public CustomerUserRuleItemPO pullCustomerUserRuleItem(int company, int area, List<Integer> uids, int did, int dtid);

	public CustomerUserRuleItemPO pullCustomerUserRuleItem(int company, int area, List<Integer> uids);

	public CustomerUserRuleItemPO pullCustomerUserRuleItem(int company, int area, int dtid, List<Integer> uids);

	public CustomerUserRuleItemPO pullCustomerUserRuleItem(int company, int area, List<Integer> uids, int did);

	public CustomerUserRuleItemPO pullCustomerUserRuleItem(int company, int area, List<Integer> uids, int did, Integer cityid); // 新增城区参数（4+1）

	public CustomerUserRuleItemPO pullCustomerUserRuleItem(int company, int area, List<Integer> uids, int did, int dtid, Integer cityid); // 新增城区参数（5+1）

	public int existCustomerUserRuleItem(int company, int area);

}
