package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.po.CustomerUserRulePO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.Paging;

public interface CustomerUserRuleDao extends Dao<CustomerUserRulePO> {

	public List<CustomerUserRulePO> pageCustomerUserRule(Paging paging, List<Filter> filters, int company);

	public CustomerUserRulePO queryCustomerUserRule(Integer uid);

	public List<UserPO> queryCustomerUserRuleByPinyin(Paging paging, String pinyin, Short status, List<Integer> companys, Integer dtid, Integer did, Integer rid);

	public CustomerUserRulePO pullCustomerUserRule(int company);

	public CustomerUserRulePO pullCustomerUserRule(int company, int area, List<Integer> userList);

	public int existCustomerUserRule(int company, int area);

	public int countCustomerUserRule(int company);

	public int countCustomerUserRule(int company, int area);

	public int pollingCustomerUserRule(int company);

	public int disableCustomerUserRule(int company);

}
