package com.fanglin.construction.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.construction.vo.ConstructionFunctionVO;
import com.fanglin.utils.Paging;

public interface ConstructionFunctionService {

	public List<ConstructionFunctionVO> pageConstructionFunction(Paging paging, List<Filter> filters);

	public List<ConstructionFunctionVO> queryConstructionFunction(ConstructionFunctionVO constructionFunctionVO);

	public List<ConstructionFunctionVO> queryConstructionFunctionByName(ConstructionFunctionVO constructionFunctionVO);

	public int addConstructionFunction(ConstructionFunctionVO constructionFunctionVO) throws FLException;

	public int updateConstructionFunction(ConstructionFunctionVO constructionFunctionVO) throws FLException;

	public int deleteConstructionFunction(ConstructionFunctionVO constructionFunctionVO) throws FLException;

}
