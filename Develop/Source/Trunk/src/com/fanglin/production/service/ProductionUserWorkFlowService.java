package com.fanglin.production.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.production.vo.ProductionUserWorkFlowVO;

public interface ProductionUserWorkFlowService {
	public List<ProductionUserWorkFlowVO> queryProductionUserWorkFlowByPwfid(ProductionUserWorkFlowVO productionUserWorkFlowVO) throws FLException;
}
