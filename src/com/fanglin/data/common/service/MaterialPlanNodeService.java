package com.fanglin.data.common.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.vo.MaterialPlanNodeVO;
import com.fanglin.utils.Paging;

public interface MaterialPlanNodeService {

	public void pageMaterialPlanNode(Paging paging, List<Filter> filters, int company);

	public List<MaterialPlanNodeVO> queryMaterialPlanNode(int company);

	public void addMaterialPlanNode(MaterialPlanNodeVO materialPlanNodeVO, int company, String userId) throws FLException;

	public void updateMaterialPlanNode(MaterialPlanNodeVO materialPlanNodeVO, int company) throws FLException;

	public void updateMaterialPlanNodeForStatus(MaterialPlanNodeVO materialPlanNodeVO) throws FLException;

}
