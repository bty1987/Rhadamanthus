package com.fanglin.production.service;

import java.util.List;

import com.fanglin.production.vo.ProductionUserWorkFlowVO;

public interface ProductionUserWorkFlowService {
	public List<ProductionUserWorkFlowVO> queryProductionUserWorkFlowsByPwfids(List<ProductionUserWorkFlowVO> productionUserWorkFlowVOs) ;
}
