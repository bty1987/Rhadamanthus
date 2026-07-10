package com.fanglin.construction.service;

import java.util.List;

import com.fanglin.construction.vo.ConstructionFunctionVO;

public interface ConstructionFunctionService {

	public List<ConstructionFunctionVO> queryConstructionFunction(ConstructionFunctionVO constructionFunctionVO);

	public List<ConstructionFunctionVO> queryConstructionFunctionByName(ConstructionFunctionVO constructionFunctionVO);

}
