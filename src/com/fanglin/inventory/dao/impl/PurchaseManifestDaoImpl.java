package com.fanglin.inventory.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.inventory.dao.PurchaseManifestDao;
import com.fanglin.inventory.po.PurchaseManifestPO;

@Repository("purchaseManifestDao")
public class PurchaseManifestDaoImpl extends DaoImpl<PurchaseManifestPO> implements PurchaseManifestDao {
	
	public PurchaseManifestDaoImpl(){
		super(PurchaseManifestPO.class);
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<PurchaseManifestPO> queryPurchaseManifestByPids(List<Long> pids) {
		return createCriteria(PurchaseManifestPO.class).createAlias("purchase", "purchase").add(Restrictions.in(PurchaseManifestPO.COLUMN_PID_STR, pids)).list();
	}

	
}
