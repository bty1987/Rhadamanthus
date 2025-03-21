package com.fanglin.customer.dao;

import com.fanglin.core.dao.Dao;
import com.fanglin.customer.po.CustomerConfigRulePO;

public interface CustomerConfigRuleDao extends Dao<CustomerConfigRulePO> {

	public CustomerConfigRulePO queryCustomerConfigRule(int company);

}
