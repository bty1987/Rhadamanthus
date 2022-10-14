package com.fanglin.communion.service;

import java.util.List;

import com.fanglin.communion.vo.ConstantVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface ConstantService {

	public void pageConstant(Paging paging, List<Filter> filters);

	public List<ConstantVO> queryConstant(ConstantVO constantVO);

	public int addConstant(ConstantVO constantVO) throws FLException;

	public int updateConstant(ConstantVO constantVO) throws FLException;

	public void updateConstantForStatus(ConstantVO constantVO) throws FLException;

	public int deleteConstant(ConstantVO constantVO) throws FLException;
}
