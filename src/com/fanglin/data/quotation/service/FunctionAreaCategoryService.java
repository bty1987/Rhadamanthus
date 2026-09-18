package com.fanglin.data.quotation.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.quotation.vo.FunctionAreaCategoryVO;
import com.fanglin.data.quotation.vo.FunctionAreaFormatVO;

public interface FunctionAreaCategoryService {

	public List<FunctionAreaCategoryVO> queryFunctionAreaCategoryByFaid(FunctionAreaCategoryVO functionAreaCategoryVO) throws FLException;

	public List<FunctionAreaFormatVO> queryFunctionAreaFormatByFacids(String facids) throws FLException;

	public int addFunctionAreaCategory(FunctionAreaCategoryVO functionAreaCategoryVO) throws FLException;

	public int deleteFunctionAreaCategory(FunctionAreaCategoryVO functionAreaCategoryVO) throws FLException;

	public int addFunctionAreaFormat(FunctionAreaFormatVO functionAreaFormatVO) throws FLException;

	public int updateFunctionAreaFormat(FunctionAreaFormatVO functionAreaFormatVO) throws FLException;

	public int deleteFunctionAreaFormat(FunctionAreaFormatVO functionAreaFormatVO) throws FLException;

}
