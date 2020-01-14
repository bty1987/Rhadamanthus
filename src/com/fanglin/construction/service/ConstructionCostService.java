package com.fanglin.construction.service;

import java.util.List;

import com.fanglin.construction.vo.ConstructionCostVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface ConstructionCostService {
	
	public void pageConstructionCost(Paging paging, List<Filter> filters, int company);
	
	public List<ConstructionCostVO> queryConstructionCost(int company);
	
	public void addConstructionCost(ConstructionCostVO constructionCostVO, int company);

	public void updateConstructionCost(ConstructionCostVO constructionCostVO) throws FLException;

	public void updateConstructionCostForStatus(ConstructionCostVO constructionCostVO);
}
