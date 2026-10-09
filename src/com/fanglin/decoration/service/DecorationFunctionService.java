package com.fanglin.decoration.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.vo.DecorationFunctionVO;
import com.fanglin.utils.Paging;

public interface DecorationFunctionService {

	public List<DecorationFunctionVO> pageDecorationFunction(Paging paging, List<Filter> filters);

	public List<DecorationFunctionVO> queryDecorationFunction(DecorationFunctionVO decorationFunctionVO);

	public List<DecorationFunctionVO> queryDecorationFunctionByName(DecorationFunctionVO decorationFunctionVO);

	public int addDecorationFunction(DecorationFunctionVO decorationFunctionVO) throws FLException;

	public int updateDecorationFunction(DecorationFunctionVO decorationFunctionVO) throws FLException;

	public int deleteDecorationFunction(DecorationFunctionVO decorationFunctionVO) throws FLException;

}
