package com.fanglin.customer.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.customer.dao.CustomerChanceOrderDao;
import com.fanglin.customer.po.CustomerChanceOrderPO;

@Repository("customerChanceOrderDao")
public class CustomerChanceOrderDaoImpl extends DaoImpl<CustomerChanceOrderPO> implements CustomerChanceOrderDao {

	public CustomerChanceOrderDaoImpl() {
		super(CustomerChanceOrderPO.class);
	}

	@Override
	public CustomerChanceOrderPO queryCustomerChanceOrder(long ccid) {
		return (CustomerChanceOrderPO) session().createCriteria(CustomerChanceOrderPO.class).add(Restrictions.eq("ccid", ccid)).setMaxResults(1).uniqueResult();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<CustomerChanceOrderPO> queryCustomerChanceOrderByOrderId(String orderId) {
		return session().createCriteria(CustomerChanceOrderPO.class).add(Restrictions.eq("orderId", orderId)).list();
	}

}
