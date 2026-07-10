package com.fanglin.customer.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.customer.dao.CustomerFunctionDao;
import com.fanglin.customer.po.CustomerFunctionPO;

@Repository("customerFunctionDao")
public class CustomerFunctionDaoImpl extends DaoImpl<CustomerFunctionPO> implements CustomerFunctionDao {

	public CustomerFunctionDaoImpl() {
		super(CustomerFunctionPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<CustomerFunctionPO> queryCustomerFunction(Short type) {

		Criteria criteria = session().createCriteria(CustomerFunctionPO.class).add(Restrictions.eq("status", CustomerFunctionPO.STATUS_ENABLE_INT));

		if (type != null) {
			criteria.add(Restrictions.eq("type", type));
		}

		return criteria.list();
	}

}
