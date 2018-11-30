package com.fanglin.sales.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.sales.po.SalesItemPO;

public interface SalesItemDao extends Dao<SalesItemPO>{
	
	public List<SalesItemPO> querySalesItemBySid(long sid);
	
	public List<SalesItemPO> querySalesItemBySids(List<Long> sids);
	
	public Float countSalesItemForAmount(long sid);
	
}
