package com.fanglin.production.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.production.po.ProductionPO;
import com.fanglin.utils.Paging;

public interface ProductionDao extends Dao<ProductionPO>{
	
	public List<ProductionPO> pageProduction(Paging paging, List<Filter> filters,int company);
	
}
