package com.fanglin.data.quotation.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.quotation.vo.FunctionAreaItemVO;

public interface FunctionAreaItemService {
	
	public List<FunctionAreaItemVO> queryFunctionAreaItemByFunctionAreaId(FunctionAreaItemVO functionAreaItemVO);

	public int addFunctionAreaItem(List<FunctionAreaItemVO> functionAreaItems) throws FLException;
	
	public int deleteFunctionAreaItemByIds(List<Long> autoIds);
	
}
