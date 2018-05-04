package com.fanglin.inventory.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.inventory.po.PurchaseManifestPO;

public interface PurchaseManifestDao extends Dao<PurchaseManifestPO>{
	
	public List<PurchaseManifestPO> queryPurchaseManifestByPids(List<Long> pids);

}
