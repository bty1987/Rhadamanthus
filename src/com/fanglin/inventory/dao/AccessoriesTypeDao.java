package com.fanglin.inventory.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.inventory.po.AccessoriesTypePO;
import com.fanglin.utils.Paging;

public interface AccessoriesTypeDao extends Dao<AccessoriesTypePO>{

	public List<AccessoriesTypePO> pageAccessoriesType(Paging paging, List<Filter> filters);
	
	public List<AccessoriesTypePO> queryAccessoriesType();
	
	public List<AccessoriesTypePO> queryAccessoriesTypeByWtid(int wtid);
	
	public AccessoriesTypePO queryAccessoriesTypeByName(String name);
	
}
