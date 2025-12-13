package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.po.CustomerUserRulePO;
import com.fanglin.utils.Paging;

public interface CustomerUserRuleDao extends Dao<CustomerUserRulePO> {

	public List<CustomerUserRulePO> pageCustomerUserRule(Paging paging, List<Filter> filters, int company);

	public CustomerUserRulePO queryCustomerUserRule(Integer uid);

	public CustomerUserRulePO pullCustomerUserRule(int company);

	public CustomerUserRulePO pullCustomerUserRule(int company, int area, List<Integer> userList);

	public int existCustomerUserRule(int company, int area);

	public int countCustomerUserRule(int company);

	public int countCustomerUserRule(int company, int area);

	public int pollingCustomerUserRule(int company);

	public int disableCustomerUserRule(int company);

	public int disableCustomerUserRuleByCurid(long curid);

}
