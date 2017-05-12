package com.fanglin.inventory.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.inventory.po.SalesItemPO;

public interface SalesItemDao extends Dao<SalesItemPO>{
	
	public List<SalesItemPO> querySalesItemBySid(long sid);
	
	public SalesItemPO querySalesItemBySiid(long siid);

}
