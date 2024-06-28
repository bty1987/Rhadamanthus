package com.fanglin.customer.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.customer.dao.CustomerUserRuleItemDao;
import com.fanglin.customer.po.CustomerUserRuleItemPO;

@Repository("customerUserRuleItemDao")
public class CustomerUserRuleItemDaoImpl extends DaoImpl<CustomerUserRuleItemPO> implements CustomerUserRuleItemDao {

	public CustomerUserRuleItemDaoImpl() {
		super(CustomerUserRuleItemPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<CustomerUserRuleItemPO> queryCustomerUserRuleItem(Long curid) {
		return session().createCriteria(CustomerUserRuleItemPO.class).add(Restrictions.eq("curid", curid)).list();
	}

}
