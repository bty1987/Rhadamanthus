package com.fanglin.production.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.production.vo.ProductionSalesVO;
import com.fanglin.production.vo.ProductionVO;

public interface ProductionSalesService {
	
	public List<ProductionSalesVO> queryProductionSalesByPid(ProductionSalesVO productionSalesVO);
	
	public int bindProductionSales (ProductionSalesVO productionSalesVO,ProductionVO productionVO) throws FLException;

}
