package com.fanglin.communion.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.communion.dao.CustomerRecordDao;
import com.fanglin.communion.po.CustomerRecordPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("customerRecordDao")
public class CustomerRecordDaoImpl extends DaoImpl<CustomerRecordPO> implements CustomerRecordDao {

	public CustomerRecordDaoImpl() {
		super(CustomerRecordPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<CustomerRecordPO> queryCustomerRecord(long cid) {
		return session().createCriteria(CustomerRecordPO.class).add(Restrictions.eq("cid", cid)).list();
	}

}
