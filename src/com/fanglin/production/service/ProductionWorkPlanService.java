package com.fanglin.production.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.production.vo.ProductionWorkPlanVO;

public interface ProductionWorkPlanService {
	public List<ProductionWorkPlanVO> queryProductionWorkPlanByPpid(long ppid);
	
	public int addProductionWorkPlan(ProductionWorkPlanVO productionWorkPlanVO,String userId) throws FLException;
	
    public int deleteProductionWorkPlan(ProductionWorkPlanVO productionWorkPlanVO) throws FLException;
}
