package com.fanglin.decoration.service;

import java.util.List;

import com.fanglin.decoration.vo.DecorationFunctionVO;

public interface DecorationFunctionService {

	public List<DecorationFunctionVO> queryDecorationFunction(DecorationFunctionVO decorationFunctionVO);
	
	public List<DecorationFunctionVO> queryDecorationFunctionByName(DecorationFunctionVO decorationFunctionVO);
	
}
