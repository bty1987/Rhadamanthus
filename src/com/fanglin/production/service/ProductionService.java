package com.fanglin.production.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.production.vo.ProductionVO;
import com.fanglin.utils.Paging;

public interface ProductionService {
	
	public void pageProduction(Paging paging, List<Filter> filters, int company);
	
	public int addProduction(ProductionVO productionVO,String userId,int company) throws FLException;
	
	public int updateProductionForStatus(ProductionVO productionVO) throws FLException;
	
	public int updateProductionForDeliveryStatus(ProductionVO productionVO) throws FLException;
	
}
