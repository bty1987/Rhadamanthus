package com.fanglin.system.service;

import java.util.List;

import com.fanglin.system.vo.FunctionVO;

public interface FunctionService {

	public List<FunctionVO> queryFunctionByModuleId(FunctionVO functionVO);
	
}
