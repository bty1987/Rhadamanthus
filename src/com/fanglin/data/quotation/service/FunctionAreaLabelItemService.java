package com.fanglin.data.quotation.service;

import java.util.List;

import com.fanglin.data.quotation.vo.FunctionAreaLabelItemVO;

public interface FunctionAreaLabelItemService {

	public List<FunctionAreaLabelItemVO> queryFunctionAreaLabelItem(FunctionAreaLabelItemVO functionAreaLabelItemVO);

	public int addFunctionAreaLabelItem(FunctionAreaLabelItemVO functionAreaLabelItemVO);

	public int deleteFunctionAreaLabelItem(FunctionAreaLabelItemVO functionAreaLabelItemVO);

}
