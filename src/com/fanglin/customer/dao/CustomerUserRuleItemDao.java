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

	public CustomerUserRuleItemPO pullCustomerUserRuleItem(int company, int area, List<Integer> uids, int did, Integer cpid); // 城区参数（4+1）

	public CustomerUserRuleItemPO pullCustomerUserRuleItem(int company, int area, List<Integer> uids, int did, int dtid, Integer cpid); // 城区参数（5+1）

	public int existCustomerUserRuleItem(int company, int area);

	/**
	 * 通过用户拼音查询客户规则项
	 * 查询逻辑：通过 pinyinName 查询 user -> 查询 customerUserRule -> 查询 customerUserRuleItem
	 * @param pinyinName 用户拼音
	 * @return 客户规则项列表
	 */
	public List<Object[]> queryCustomerUserRuleItemByPinyin(String pinyinName);

}
