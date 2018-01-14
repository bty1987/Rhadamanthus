package com.fanglin.production.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.production.po.ProductionPlanItemPO;
import com.fanglin.utils.Paging;

public interface ProductionPlanItemDao extends Dao<ProductionPlanItemPO>{
	
	public List<ProductionPlanItemPO> pageProductionPlanItemByPpid(Paging paging,List<Filter> filters,long ppid);
}
