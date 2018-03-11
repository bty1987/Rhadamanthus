package com.fanglin.communion.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.communion.dao.SupplierUserRightDao;
import com.fanglin.communion.po.SupplierUserRightPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("supplierUserRightDao")
public class SupplierUserRightDaoImpl extends DaoImpl<SupplierUserRightPO> implements SupplierUserRightDao {
	
	public SupplierUserRightDaoImpl(){
		super(SupplierUserRightPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<SupplierUserRightPO> querySupplierUserRightBySId(long sId) {
		return session().createCriteria(SupplierUserRightPO.class).add(Restrictions.eq(SupplierUserRightPO.COLUMN_SID_STR, sId)).list();
	}

	@Override
	public int deleteSupplierUserRightBySId(long sId) {
		
		String sql = "delete from communion.supplieruserright where sid =:sid";
		session().createSQLQuery(sql).setLong("sid", sId).executeUpdate();
		
		return 0;
	}

}
