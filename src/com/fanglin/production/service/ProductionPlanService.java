package com.fanglin.production.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.production.vo.ProductionPlanVO;
import com.fanglin.utils.Paging;

public interface ProductionPlanService {
	
	public void pageProductionPlan(Paging paging,List<Filter> filter,int company);
	
	public List<ProductionPlanVO> queryProductionPlanByPid(ProductionPlanVO productionPlanVO);
	
	public int addProductionPlan(ProductionPlanVO productionPlanVO, int company, String userId) throws FLException;
	
	public int updateProductionPlan(ProductionPlanVO productionPlanVO) throws FLException;
	
	public int finishProductionPlan(ProductionPlanVO productionPlanVO, String userId) throws FLException;
}
