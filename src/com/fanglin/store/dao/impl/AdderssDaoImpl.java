package com.fanglin.store.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
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

		return session().createCriteria(AddressPO.class).add(Restrictions.eq(AddressPO.COLUMN_UID_STR, uid)).list();

	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<AddressPO> queryAddress(long uid ,short status) {
		
		Criteria criteria = session().createCriteria(AddressPO.class).add(Restrictions.eq(AddressPO.COLUMN_UID_STR, uid));
		
		if(status == 1){
			criteria.add(Restrictions.eq("status",AddressPO.STATUS_DEFAULT_SHORT));
		}else if(status == 2){
			criteria.add(Restrictions.ne("status",AddressPO.STATUS_DISABLE_SHORT));
		}
		
		return criteria.list();
	}

	@Override
	public void updateAddressByUid(long uid) {
		
		String sql = "UPDATE store.address SET status = :status  WHERE uid = :uid AND status <> 2";

		session().createSQLQuery(sql).setShort("status", AddressPO.STATUS_ABLE_SHORT).setLong("uid", uid).executeUpdate();
		
	}

}
