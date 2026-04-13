package com.fanglin.communion.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.communion.dao.CustomerAccountDao;
import com.fanglin.communion.po.CustomerAccountPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("customerAccountDao")
public class CustomerAccountDaoImpl extends DaoImpl<CustomerAccountPO> implements CustomerAccountDao {

	public CustomerAccountDaoImpl() {
		super(CustomerAccountPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<CustomerAccountPO> queryCustomerAccountByCid(long cid) {
		return session().createCriteria(CustomerAccountPO.class)
			.add(Restrictions.eq(CustomerAccountPO.COLUMN_CID_STR, cid))
			.add(Restrictions.eq(CustomerAccountPO.COLUMN_STATUS_STR, CustomerAccountPO.STATUS_ENABLE))
			.list();
	}

	@Override
	public CustomerAccountPO queryDefaultCustomerAccount(long cid) {
		return (CustomerAccountPO) session().createCriteria(CustomerAccountPO.class)
			.add(Restrictions.eq(CustomerAccountPO.COLUMN_CID_STR, cid))
			.add(Restrictions.eq(CustomerAccountPO.COLUMN_STATUS_STR, CustomerAccountPO.STATUS_ENABLE))
			.add(Restrictions.eq(CustomerAccountPO.COLUMN_DEFAULTS_STR, CustomerAccountPO.DEFAULTS_YES))
			.uniqueResult();
	}

	@Override
	public CustomerAccountPO queryCustomerAccountByBankno(String bankno) {
		return (CustomerAccountPO) session().createCriteria(CustomerAccountPO.class)
			.add(Restrictions.eq(CustomerAccountPO.COLUMN_BANKNO_STR, bankno))
			.add(Restrictions.eq(CustomerAccountPO.COLUMN_STATUS_STR, CustomerAccountPO.STATUS_ENABLE))
			.uniqueResult();
	}

	@Override
	public int countCustomerAccountByCid(long cid) {
		String hql = "select count(*) from CustomerAccountPO where cid = :cid and status = :status";
		Long count = (Long) session().createQuery(hql)
			.setLong("cid", cid)
			.setShort("status", CustomerAccountPO.STATUS_ENABLE)
			.uniqueResult();
		return count != null ? count.intValue() : 0;
	}

}
