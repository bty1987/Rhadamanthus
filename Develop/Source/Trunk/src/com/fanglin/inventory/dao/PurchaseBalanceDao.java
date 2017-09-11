package com.fanglin.inventory.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.inventory.po.PurchaseBalancePO;

public interface PurchaseBalanceDao extends Dao<PurchaseBalancePO> {

	public List<PurchaseBalancePO> queryPurchaseBalanceByPid(long pid);
	
}
