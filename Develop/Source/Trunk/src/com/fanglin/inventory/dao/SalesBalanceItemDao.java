package com.fanglin.inventory.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.inventory.po.SalesBalanceItemPO;

public interface SalesBalanceItemDao extends Dao<SalesBalanceItemPO>{
	
	public List<SalesBalanceItemPO> querySalesBalanceItemBySbid(long sbid);

}
