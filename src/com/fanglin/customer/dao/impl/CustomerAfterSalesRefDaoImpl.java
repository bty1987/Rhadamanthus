package com.fanglin.customer.dao.impl;

import java.util.List;

import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.customer.dao.CustomerAfterSalesRefDao;
import com.fanglin.customer.po.CustomerAfterSalesRefPO;

@Repository("customerAfterSalesRefDao")
public class CustomerAfterSalesRefDaoImpl extends DaoImpl<CustomerAfterSalesRefPO> implements CustomerAfterSalesRefDao {

	public CustomerAfterSalesRefDaoImpl() {
		super(CustomerAfterSalesRefPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<CustomerAfterSalesRefPO> queryCustomerAfterSalesRef(long asid) {
		return session().createCriteria(CustomerAfterSalesRefPO.class).createAlias("customerAfterSales", "customerAfterSales").add(Restrictions.eq("customerAfterSales.asid", asid)).addOrder(Order.asc("asfid")).list();
	}

	@Override
	public CustomerAfterSalesRefPO queryCustomerAfterSalesRef(short type, long refId) {
		return (CustomerAfterSalesRefPO) session().createCriteria(CustomerAfterSalesRefPO.class).add(Restrictions.eq("type", type)).add(Restrictions.eq("refId", refId)).setMaxResults(1).uniqueResult();
	}

}
