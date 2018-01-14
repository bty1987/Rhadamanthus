package com.fanglin.inventory.dao.impl;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.inventory.dao.PurchaseManifestDao;
import com.fanglin.inventory.po.PurchaseManifestPO;

@Repository("purchaseManifestDao")
public class PurchaseManifestDaoImpl extends DaoImpl<PurchaseManifestPO> implements PurchaseManifestDao {
	
	public PurchaseManifestDaoImpl(){
		super(PurchaseManifestPO.class);
	}
	
}
