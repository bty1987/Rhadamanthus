package com.fanglin.inventory.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.inventory.po.AccessoriesItemPO;

public interface AccessoriesItemDao extends Dao<AccessoriesItemPO>{
	
	public List<AccessoriesItemPO> queryAccessoriesItemByAid(long aid);
	
	public List<AccessoriesItemPO> queryAccessoriesItemByAids(List<Long> aids);

}
