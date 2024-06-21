package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.po.CustomerDeptRulePO;
import com.fanglin.utils.Paging;

public interface CustomerDeptRuleDao extends Dao<CustomerDeptRulePO> {

	public List<CustomerDeptRulePO> pageCustomerDeptRule(Paging paging, List<Filter> filters) throws FLException;

	public CustomerDeptRulePO queryCustomerDeptRule(Integer did);

	public List<CustomerDeptRulePO> queryCustomerDeptRule(Integer did, Short type);

}
