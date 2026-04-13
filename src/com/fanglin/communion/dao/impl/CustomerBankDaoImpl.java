package com.fanglin.communion.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.communion.dao.CustomerBankDao;
import com.fanglin.communion.po.CustomerBankPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("customerBankDao")
public class CustomerBankDaoImpl extends DaoImpl<CustomerBankPO> implements CustomerBankDao {

	public CustomerBankDaoImpl() {
		super(CustomerBankPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<CustomerBankPO> queryCustomerBankByCid(long cid) {
		return session().createCriteria(CustomerBankPO.class)
			.add(Restrictions.eq(CustomerBankPO.COLUMN_CID_STR, cid))
			.add(Restrictions.eq(CustomerBankPO.COLUMN_STATUS_STR, CustomerBankPO.STATUS_ENABLE))
			.list();
	}

	@Override
	public CustomerBankPO queryDefaultCustomerBank(long cid) {
		return (CustomerBankPO) session().createCriteria(CustomerBankPO.class)
			.add(Restrictions.eq(CustomerBankPO.COLUMN_CID_STR, cid))
			.add(Restrictions.eq(CustomerBankPO.COLUMN_STATUS_STR, CustomerBankPO.STATUS_ENABLE))
			.add(Restrictions.eq(CustomerBankPO.COLUMN_DEFAULTS_STR, CustomerBankPO.DEFAULTS_YES))
			.uniqueResult();
	}

	@Override
	public CustomerBankPO queryCustomerBankByBankno(String bankno) {
		return (CustomerBankPO) session().createCriteria(CustomerBankPO.class)
			.add(Restrictions.eq(CustomerBankPO.COLUMN_BANKNO_STR, bankno))
			.add(Restrictions.eq(CustomerBankPO.COLUMN_STATUS_STR, CustomerBankPO.STATUS_ENABLE))
			.uniqueResult();
	}

	@Override
	public int countCustomerBankByCid(long cid) {
		String hql = "select count(*) from CustomerBankPO where cid = :cid and status = :status";
		Long count = (Long) session().createQuery(hql)
			.setLong("cid", cid)
			.setShort("status", CustomerBankPO.STATUS_ENABLE)
			.uniqueResult();
		return count != null ? count.intValue() : 0;
	}

}
