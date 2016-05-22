package com.fanglin.system.service;

import java.util.List;

import com.fanglin.system.vo.SubFunctionVO;

public interface SubFunctionService {
	
	public List<SubFunctionVO> querySubFunction();

	public SubFunctionVO querySubFunctionById(SubFunctionVO subFunctionVO);
	
	public List<SubFunctionVO> querySubFunctionByFunctionId(SubFunctionVO subFunctionVO);
	
	public List<SubFunctionVO> querySubFunctionByIds(List<Integer> subFunctionIds);
	
	public List<SubFunctionVO> querySubFunctionLikeName(SubFunctionVO subFunctionVO);
	
}
