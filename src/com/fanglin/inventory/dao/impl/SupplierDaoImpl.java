package com.fanglin.inventory.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.inventory.dao.SupplierDao;
import com.fanglin.inventory.po.SupplierPO;

@Repository("supplierDao")
public class SupplierDaoImpl extends DaoImpl<SupplierPO> implements SupplierDao{

	public SupplierDaoImpl(){
		super(SupplierPO.class);
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<SupplierPO> querySupplierByGid(long gid) {
		return session().createCriteria(SupplierPO.class).add(Restrictions.eq(SupplierPO.COLUMN_GID_STR, gid)).list();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<SupplierPO> querySupplierForEnableByGid(long gid) {
		return session().createCriteria(SupplierPO.class).add(Restrictions.eq(SupplierPO.COLUMN_GID_STR, gid)).add(Restrictions.eq(SupplierPO.COLUMN_STATUS_STR, SupplierPO.STATUS_ENABLE_INT)).list();
	}

	@Override
	public SupplierPO querySupplierByName(long gid, String name) {
		return (SupplierPO) session().createCriteria(SupplierPO.class).add(Restrictions.eq(SupplierPO.COLUMN_GID_STR, gid)).add(Restrictions.eq(SupplierPO.COLUMN_NAME_STR, name)).uniqueResult();
	}

}
