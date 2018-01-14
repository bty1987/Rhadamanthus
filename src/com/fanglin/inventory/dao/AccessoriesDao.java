package com.fanglin.inventory.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.inventory.po.AccessoriesPO;
import com.fanglin.utils.Paging;

public interface AccessoriesDao extends Dao<AccessoriesPO>{
	
	public List<AccessoriesPO> pageAccessories(Paging paging,List<Filter> filters,int company);
	
}
