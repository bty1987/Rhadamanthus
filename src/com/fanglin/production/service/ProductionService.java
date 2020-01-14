package com.fanglin.production.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.production.vo.ProductionVO;
import com.fanglin.utils.Paging;

public interface ProductionService {
	
	public void pageProduction(Paging paging, List<Filter> filters, int company);
	
	public int addProduction(ProductionVO productionVO,String userId,int company) throws FLException;
	
	public int updateProduction(ProductionVO productionVO) throws FLException;
	
	public int updateProductionForAdvance(ProductionVO productionVO) throws FLException;
	
	public int designProduction(ProductionVO productionVO) throws FLException;
	
	public int splitProduction(ProductionVO productionVO) throws FLException;
	
	public int instoreProduction(ProductionVO productionVO) throws FLException;
	
	public int planProduction(ProductionVO productionVO) throws FLException;
	
	public int mountProduction(ProductionVO productionVO) throws FLException;
	
	public int finishProduction(ProductionVO productionVO) throws FLException;
	
	public int terminalProduction(ProductionVO productionVO) throws FLException;

	public int tranProduction(ProductionVO production) throws FLException;

	public int upholdProduction(ProductionVO productionVO) throws FLException;

}
