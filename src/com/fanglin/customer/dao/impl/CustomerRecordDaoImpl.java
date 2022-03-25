package com.fanglin.customer.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.customer.dao.CustomerRecordDao;
import com.fanglin.customer.po.CustomerRecordPO;

@Repository("customerRecordDao")
public class CustomerRecordDaoImpl extends DaoImpl<CustomerRecordPO> implements CustomerRecordDao {

	public CustomerRecordDaoImpl() {
		super(CustomerRecordPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<CustomerRecordPO> queryCustomerRecord(long csid) {
		return session().createCriteria(CustomerRecordPO.class).add(Restrictions.eq("csid", csid)).list();
	}

}
