package com.fanglin.data.material.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.AccessoriesTypePO;
import com.fanglin.utils.Paging;

public interface AccessoriesTypeDao extends Dao<AccessoriesTypePO>{

	public List<AccessoriesTypePO> pageAccessoriesType(Paging paging, List<Filter> filters);
	
	public List<AccessoriesTypePO> queryAccessoriesType();
	
	public List<AccessoriesTypePO> queryAccessoriesTypeByWtid(int wtid);
	
	public AccessoriesTypePO queryAccessoriesTypeByName(String name);
	
}
