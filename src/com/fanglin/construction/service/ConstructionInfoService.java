package com.fanglin.construction.service;

import com.fanglin.construction.vo.ConstructionInfoVO;

public interface ConstructionInfoService {

	public ConstructionInfoVO queryConstructionInfo(ConstructionInfoVO constructionInfoVO);

	public ConstructionInfoVO queryConstructionInfoByOrderId(ConstructionInfoVO constructionInfoVO);

	public void updateConstructionInfo(ConstructionInfoVO constructionInfoVO);

	public void updateConstructionInfoByOrderId(ConstructionInfoVO constructionInfoVO);

}
