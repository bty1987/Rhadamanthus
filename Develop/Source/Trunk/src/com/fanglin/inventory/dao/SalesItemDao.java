package com.fanglin.inventory.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.inventory.po.SalesItemPO;

public interface SalesItemDao extends Dao<SalesItemPO>{
	
	public List<SalesItemPO> querySalesItemBySid(long sid);
	
	public List<SalesItemPO> querySalesItemBySids(List<Long> sids);
	
	public SalesItemPO querySalesItemBySiid(long siid);

}
