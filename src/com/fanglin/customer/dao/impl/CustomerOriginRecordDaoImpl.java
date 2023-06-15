package com.fanglin.customer.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.customer.dao.CustomerOriginRecordDao;
import com.fanglin.customer.po.CustomerOriginRecordPO;

@Repository("customerOriginRecordDao")
public class CustomerOriginRecordDaoImpl extends DaoImpl<CustomerOriginRecordPO> implements CustomerOriginRecordDao {

	public CustomerOriginRecordDaoImpl() {
		super(CustomerOriginRecordPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<CustomerOriginRecordPO> queryCustomerOriginRecord(long csid) {
		return session().createCriteria(CustomerOriginRecordPO.class).add(Restrictions.eq("csid", csid)).list();
	}

}
