package com.fanglin.customer.dao.impl;

import java.util.List;

import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.customer.dao.CustomerAfterSalesRecordDao;
import com.fanglin.customer.po.CustomerAfterSalesRecordPO;

@Repository("customerAfterSalesRecordDao")
public class CustomerAfterSalesRecordDaoImpl extends DaoImpl<CustomerAfterSalesRecordPO> implements CustomerAfterSalesRecordDao {

	public CustomerAfterSalesRecordDaoImpl() {
		super(CustomerAfterSalesRecordPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<CustomerAfterSalesRecordPO> queryCustomerAfterSalesRecord(long asid) {
		return session().createCriteria(CustomerAfterSalesRecordPO.class).createAlias("customerAfterSales", "customerAfterSales").add(Restrictions.eq("customerAfterSales.asid", asid)).addOrder(Order.asc("operateTime")).addOrder(Order.asc("asrid")).list();
	}

}
