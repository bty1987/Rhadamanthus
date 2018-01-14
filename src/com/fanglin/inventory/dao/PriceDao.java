package com.fanglin.inventory.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.inventory.po.PricePO;

public interface PriceDao extends Dao<PricePO>{
	
	public List<PricePO> queryPriceByGid(long gid);
	
	public PricePO queryPriceByPid(long pid);
}
