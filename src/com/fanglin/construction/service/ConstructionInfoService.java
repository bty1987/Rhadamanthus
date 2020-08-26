package com.fanglin.construction.service;

import java.util.List;

import com.fanglin.construction.vo.ConstructionInfoVO;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface ConstructionInfoService {
	
	public void pageConstructionInfo(Paging paging, List<Filter> filters, Integer company);

	public ConstructionInfoVO queryConstructionInfo(ConstructionInfoVO constructionInfoVO);

	public ConstructionInfoVO queryConstructionInfoByOrderId(ConstructionInfoVO constructionInfoVO);

	public void updateConstructionInfo(ConstructionInfoVO constructionInfoVO);

	public void updateConstructionInfoByOrderId(ConstructionInfoVO constructionInfoVO);

}
