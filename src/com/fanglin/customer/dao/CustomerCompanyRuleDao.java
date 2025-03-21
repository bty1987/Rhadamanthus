package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.po.CustomerCompanyRulePO;
import com.fanglin.utils.Paging;

public interface CustomerCompanyRuleDao extends Dao<CustomerCompanyRulePO> {

	public List<CustomerCompanyRulePO> pageCustomerCompanyRule(Paging paging, List<Filter> filters, int company) throws FLException;

	public List<CustomerCompanyRulePO> queryCustomerCompanyRule(int company, Integer did, Integer val);

}
