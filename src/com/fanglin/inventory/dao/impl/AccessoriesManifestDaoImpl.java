package com.fanglin.inventory.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.inventory.dao.AccessoriesManifestDao;
import com.fanglin.inventory.po.AccessoriesManifestPO;

@Repository("accessoriesManifestDao")
public class AccessoriesManifestDaoImpl extends DaoImpl<AccessoriesManifestPO> implements AccessoriesManifestDao {
	
	public AccessoriesManifestDaoImpl(){
		super(AccessoriesManifestPO.class);
	}

	@Override
	public AccessoriesManifestPO queryManifestByAid(long aid) {
		return (AccessoriesManifestPO) session().createCriteria(AccessoriesManifestPO.class).createAlias("accessories", "accessories").add(Restrictions.eq(AccessoriesManifestPO.COLUMN_AID_STR, aid)).uniqueResult();
	}
	
}
