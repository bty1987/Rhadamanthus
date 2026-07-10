package com.fanglin.right.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.right.vo.ConstructionFunctionRightVO;

public interface ConstructionFunctionRightService {

	public List<ConstructionFunctionRightVO> queryConstructionFunctionRightByName(ConstructionFunctionRightVO constructionFunctionRightVO, int company);

	public void updateConstructionFunctionRight(ConstructionFunctionRightVO constructionFunctionRightVO, List<Long> cfids, int company);

	public int syncConstructionFunctionRight(ConstructionFunctionRightVO constructionFunctionRightVO, List<String> companys, Integer company) throws FLException;

}
