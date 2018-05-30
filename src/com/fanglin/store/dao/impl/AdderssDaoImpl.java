package com.fanglin.store.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.store.dao.AddressDao;
import com.fanglin.store.po.AddressPO;

@Repository("addressDao")
public class AdderssDaoImpl extends DaoImpl<AddressPO> implements AddressDao {

	public AdderssDaoImpl() {
		super(AddressPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<AddressPO> queryAddressByUid(long uid) {

		return session().createCriteria(AddressPO.class).add(Restrictions.eq(AddressPO.COLUMN_UID_STR, uid)).add(Restrictions.ne("status", AddressPO.STATUS_DISABLE_SHORT)).list();

	}

	@Override
	public void updateAddressByUid(long uid) {
		
		String sql = "UPDATE store.address SET status = :status  WHERE uid = :uid";

		session().createSQLQuery(sql).setShort("status", AddressPO.STATUS_ABLE_SHORT).setLong("uid", uid).executeUpdate();
		
	}

}
