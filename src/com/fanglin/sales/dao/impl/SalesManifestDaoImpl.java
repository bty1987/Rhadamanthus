package com.fanglin.sales.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.sales.dao.SalesManifestDao;
import com.fanglin.sales.po.SalesManifestPO;

@Repository("salesManifestDao")
public class SalesManifestDaoImpl extends DaoImpl<SalesManifestPO> implements SalesManifestDao {

	public SalesManifestDaoImpl(){
		super(SalesManifestPO.class);
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<SalesManifestPO> querySalesManifestBySid(long sid) {
		return createCriteria(SalesManifestPO.class).createAlias("sales", "sales").add(Restrictions.eq(SalesManifestPO.COLUMN_SALESSID_STR, sid)).list();
	}
	
}
