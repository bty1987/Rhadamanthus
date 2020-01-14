package com.fanglin.inventory.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.inventory.dao.AccessoriesManifestDao;
import com.fanglin.inventory.po.AccessoriesManifestPO;

@Repository("accessoriesManifestDao")
public class AccessoriesManifestDaoImpl extends DaoImpl<AccessoriesManifestPO> implements AccessoriesManifestDao {

	public AccessoriesManifestDaoImpl() {
		super(AccessoriesManifestPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<AccessoriesManifestPO> queryManifestByAid(long aid, Short type) {
		
		Criteria criteria = session().createCriteria(AccessoriesManifestPO.class);
		
		criteria.createAlias("accessories", "accessories").add(Restrictions.eq(AccessoriesManifestPO.COLUMN_AID_STR, aid));
		
		if (type != null) {
			criteria.createAlias("manifest", "manifest").add(Restrictions.eq(AccessoriesManifestPO.COLUMN_TYPE_STR, type));
		}
				
		return criteria.list();

	}

}
