package com.fanglin.production.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.production.vo.ProductionPlanItemVO;
import com.fanglin.utils.Paging;

public interface ProductionPlanItemService {
	
	public void pageProductionPlanItemByPpid(Paging paging,List<Filter> filter,long ppid);
	
	public int addProductionPlanItem(ProductionPlanItemVO productionPlanItemVO) throws FLException;
	
	public int deleteProductionPlanItem(ProductionPlanItemVO productionPlanItemVO) throws FLException;
}
