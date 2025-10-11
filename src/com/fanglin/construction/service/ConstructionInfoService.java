package com.fanglin.construction.service;

import java.util.List;

import com.fanglin.construction.vo.ConstructionInfoVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface ConstructionInfoService {

	public void pageConstructionInfo(Paging paging, List<Filter> filters, ConstructionInfoVO constructionInfoVO, Integer company) throws FLException;

	public ConstructionInfoVO queryConstructionInfo(ConstructionInfoVO constructionInfoVO);

	public ConstructionInfoVO queryConstructionInfoByOrderId(ConstructionInfoVO constructionInfoVO);

	public List<?> countConstructionInfo(ConstructionInfoVO constructionInfoVO, int company);

	public void updateConstructionInfo(ConstructionInfoVO constructionInfoVO) throws FLException;

	public void updateConstructionInfoByOrderId(ConstructionInfoVO constructionInfoVO) throws FLException;

	public void checkConstructionInfo(ConstructionInfoVO constructionInfoVO) throws FLException;

}
