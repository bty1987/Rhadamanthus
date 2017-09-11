package com.fanglin.production.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.production.vo.ProductionWorkFlowVO;

public interface ProductionWorkFlowService {
	
	public List<ProductionWorkFlowVO> queryProductionWorkFlowByPwpid(ProductionWorkFlowVO productionworkflowVO);
	
	public ProductionWorkFlowVO queryProductionWorkFlowByPwpidAWfid(ProductionWorkFlowVO productionworkflowVO) throws FLException;
	
	public int operateProductionWorkFlow(String no,long uid,ProductionWorkFlowVO productionWorkFlowVO) throws FLException;
}
