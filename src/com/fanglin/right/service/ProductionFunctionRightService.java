package com.fanglin.right.service;

import java.util.List;

import com.fanglin.right.vo.ProductionFunctionRightVO;

public interface ProductionFunctionRightService {

	public List<ProductionFunctionRightVO> queryProductionFunctionRightByName(ProductionFunctionRightVO productionFunctionRightVO);

	public void updateProductionFunctionRight(ProductionFunctionRightVO productionFunctionRightVO, List<Long> pfids, int company);

}
