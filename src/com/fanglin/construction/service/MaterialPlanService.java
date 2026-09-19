package com.fanglin.construction.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.construction.vo.MaterialPlanVO;

public interface MaterialPlanService {

	public List<MaterialPlanVO> queryMaterialPlanByOrderId(MaterialPlanVO materialPlanVO) throws FLException;

	public void makeMaterialPlan(MaterialPlanVO materialPlanVO) throws FLException;

	public void addMaterialPlan(MaterialPlanVO materialPlanVO, String userId) throws FLException;

	public void updateMaterialPlan(MaterialPlanVO materialPlanVO) throws FLException;

	public void confirmMaterialPlan(MaterialPlanVO materialPlanVO, String userId) throws FLException;

	public void cancelMaterialPlan(MaterialPlanVO materialPlanVO, String userId) throws FLException;

	public void deleteMaterialPlan(MaterialPlanVO materialPlanVO) throws FLException;

}
