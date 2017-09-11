package com.fanglin.production.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.production.po.ProductionWorkPlanPO;

public interface ProductionWorkPlanDao extends Dao<ProductionWorkPlanPO>{
	
	public List<ProductionWorkPlanPO> queryProductionWorkPlanByPpid(long ppid);
}
