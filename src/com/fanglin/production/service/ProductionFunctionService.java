package com.fanglin.production.service;

import java.util.List;

import com.fanglin.production.vo.ProductionFunctionVO;

public interface ProductionFunctionService {

	public List<ProductionFunctionVO> queryProductionFunction(ProductionFunctionVO productionFunction);

	public List<ProductionFunctionVO> queryProductionFunctionByName(ProductionFunctionVO productionFunctiona);

}
