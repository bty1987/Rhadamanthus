package com.fanglin.production.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.production.po.ProductionPlanPO;
import com.fanglin.utils.Paging;

public interface ProductionPlanDao extends Dao<ProductionPlanPO>{
	
	 public List<ProductionPlanPO> pageProductionPlan(Paging paging,List<Filter> filter,long pid);
	 	 
	 public List<ProductionPlanPO> queryProductionPlanByPid(long pid);
	 
	 public ProductionPlanPO queryProductionPlanByNo(String no);
}
