package com.fanglin.communion.dao.impl;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.SQLQuery;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.communion.dao.CustomerPhoneDao;
import com.fanglin.communion.po.CustomerPhonePO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.utils.SystemConfig;

@Repository("customerPhoneDao")
public class CustomerPhoneDaoImpl extends DaoImpl<CustomerPhonePO> implements CustomerPhoneDao {

	public CustomerPhoneDaoImpl() {
		super(CustomerPhonePO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<CustomerPhonePO> queryCustomerPhoneByCid(Long cid, Short status) {

		Criteria query = session().createCriteria(CustomerPhonePO.class).add(Restrictions.eq("cid", cid));

		if (status != null) {
			query.add(Restrictions.eq(CustomerPhonePO.COLUMN_STATUS_STR, status));
		}

		return query.list();
	}

	@Override
	public List<CustomerPhonePO> queryCustomerPhoneByPhone(String phone, Short status, Integer company) {
		return queryCustomerPhone(Arrays.asList(phone), status, null, company);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<CustomerPhonePO> queryCustomerPhone(List<String> phones, Short status, Short defaults, Integer company) {

		if (phones == null || phones.isEmpty()) {
			return new ArrayList<CustomerPhonePO>();
		}

		StringBuffer sql = new StringBuffer();
		sql.append("select cp.* ");
		sql.append("from communion.customer c left join communion.customerphone cp on c.cid = cp.cid ");
		sql.append("where (cp.phone in (:cphones) or c.phone in (:phones))");

		if (defaults != null) {
			sql.append(" and cp.defaults = :defaults");
		}

		if (status != null) {
			sql.append(" and cp.status = :status");
		} else {
			sql.append(" and cp.status = 0");
		}

		if (SystemConfig.getInt("multicompany", 0) != 0) {
			sql.append(" and c.company = :company ");
		}

		SQLQuery query = session().createSQLQuery(sql.toString()).addEntity(CustomerPhonePO.class);

		query.setParameterList("cphones", phones).setParameterList("phones", phones);

		if (SystemConfig.getInt("multicompany", 0) != 0) {
			query.setInteger("company", company);
		}

		if (defaults != null) {
			query.setShort("defaults", defaults);
		}

		if (status != null) {
			query.setShort("status", status);
		}

		return query.list();
	}

	@Override
	public CustomerPhonePO queryCustomerPhone(Long cid, String phone) {
		return (CustomerPhonePO) session().createCriteria(CustomerPhonePO.class).add(Restrictions.eq("phone", phone)).add(Restrictions.eq("cid", cid)).uniqueResult();
	}

	@Override
	public CustomerPhonePO queryCustomerPhoneForDefault(String phone, Integer company) {

		StringBuffer sql = new StringBuffer();

		sql.append("select cp.* ");
		sql.append("from communion.customer c left join communion.customerphone cp on c.cid = cp.cid ");
		sql.append("where cp.phone =:phone and cp.defaults = 1 and cp.status = 0");

		if (SystemConfig.getInt("multicompany", 0) != 0) {
			sql.append(" and c.company =:company ");
		}

		SQLQuery query = session().createSQLQuery(sql.toString()).addEntity(CustomerPhonePO.class);

		query.setString("phone", phone);

		if (SystemConfig.getInt("multicompany", 0) != 0) {
			query.setInteger("company", company);
		}

		return (CustomerPhonePO) query.setMaxResults(1).uniqueResult();
	}

	@Override
	public int countCustomerPhone(String phone) {

		String sql = "select count(*) from communion.customerphone where phone  =:phone";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setString("phone", phone).uniqueResult();

		return count.intValue();
	}

	@Override
	public int clearCustomerPhoneForDefault(Long cid) {

		String sql = "update communion.customerphone c set c.defaults = 0 where c.cid = :cid";

		return session().createSQLQuery(sql).setLong("cid", cid).executeUpdate();
	}

}
