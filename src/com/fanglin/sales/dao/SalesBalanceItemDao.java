package com.fanglin.sales.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.sales.po.SalesBalanceItemPO;

public interface SalesBalanceItemDao extends Dao<SalesBalanceItemPO>{
	
	public List<SalesBalanceItemPO> querySalesBalanceItemBySbid(long sbid);

}
