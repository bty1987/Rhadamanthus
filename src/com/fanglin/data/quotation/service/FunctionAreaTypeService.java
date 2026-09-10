package com.fanglin.data.quotation.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.quotation.vo.FunctionAreaTypeVO;
import com.fanglin.utils.Paging;

public interface FunctionAreaTypeService {

	public void pageFunctionAreaType(Paging paging, List<Filter> filters, int company);

	public List<FunctionAreaTypeVO> queryFunctionAreaType(int company) throws FLException;

	public int addFunctionAreaType(FunctionAreaTypeVO functionAreaTypeVO, int company) throws FLException;

	public int updateFunctionAreaType(FunctionAreaTypeVO functionAreaTypeVO) throws FLException;

	public int updateFunctionAreaTypeForStatus(FunctionAreaTypeVO functionAreaTypeVO) throws FLException;

	public int deleteFunctionAreaType(FunctionAreaTypeVO functionAreaTypeVO) throws FLException;

}
