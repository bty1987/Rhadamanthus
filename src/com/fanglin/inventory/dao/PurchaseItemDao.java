package com.fanglin.inventory.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.inventory.po.PurchaseItemPO;

public interface PurchaseItemDao extends Dao<PurchaseItemPO> {

	public List<PurchaseItemPO> queryPurchaseItemByPid(long pid);
	
	public List<PurchaseItemPO> queryPurchaseItemByPids(List<Long> pids);
	
	public float amountPurchaseItemForNum(long pid);
	
}
