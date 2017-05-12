package com.fanglin.inventory.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.inventory.po.AssisOrderItemPO;

public interface AssisOrderItemDao extends Dao<AssisOrderItemPO>{
	
	public List<AssisOrderItemPO> queryAssisOrderItemByAoid(long aoid);
	
	public List<AssisOrderItemPO> queryAssisOrderItemByAoids(List<Long> aoids);

}
