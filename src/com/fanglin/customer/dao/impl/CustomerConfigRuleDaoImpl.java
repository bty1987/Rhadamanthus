package com.fanglin.customer.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.customer.dao.CustomerConfigRuleDao;
import com.fanglin.customer.po.CustomerConfigRulePO;

@Repository("customerConfigRuleDao")
public class CustomerConfigRuleDaoImpl extends DaoImpl<CustomerConfigRulePO> implements CustomerConfigRuleDao {

	public CustomerConfigRuleDaoImpl() {
		super(CustomerConfigRulePO.class);
	}

	@Override
	public CustomerConfigRulePO queryCustomerConfigRule(int company) {
		return (CustomerConfigRulePO) session().createCriteria(CustomerConfigRulePO.class).add(Restrictions.eq("company", company)).setMaxResults(1).uniqueResult();
	}

}
