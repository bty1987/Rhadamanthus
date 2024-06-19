package com.fanglin.data.quotation.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.quotation.vo.FunctionAreaItemVO;
import com.fanglin.data.quotation.vo.FunctionAreaVO;

public interface FunctionAreaItemService {

	public List<FunctionAreaItemVO> queryFunctionAreaItemByFunctionAreaId(FunctionAreaItemVO functionAreaItemVO);

	public int addFunctionAreaItem(FunctionAreaVO functionAreaVO, List<FunctionAreaItemVO> functionAreaItems) throws FLException;

	public void updateFunctionAreaItem(FunctionAreaItemVO functionAreaItemVO) throws FLException;

	public int updateFunctionAreaItemForSort(List<FunctionAreaItemVO> functionAreaItems) throws FLException;

	public int deleteFunctionAreaItemByIds(List<Long> autoIds);

}
