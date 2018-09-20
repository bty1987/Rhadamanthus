package com.fanglin.production.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.production.vo.ProductionPlanVO;
import com.fanglin.utils.Paging;

public interface ProductionPlanService {
	
	public void pageProductionPlan(Paging paging,List<Filter> filter,long pid);
	
	public List<ProductionPlanVO> queryProductionPlanByPid(ProductionPlanVO productionPlanVO);
	
	public ProductionPlanVO queryProductionPlanByNo(ProductionPlanVO productionPlanVO) throws FLException;
	
	public int addProductionPlan(ProductionPlanVO productionPlanVO, int company) throws FLException;
	
	public int updateProductionPlan(ProductionPlanVO productionPlanVO) throws FLException;
	
	public int updateProductionPlanForStatus(ProductionPlanVO productionPlanVO) throws FLException;
}
