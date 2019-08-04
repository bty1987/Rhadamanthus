package com.fanglin.right.service;

import java.util.List;

import com.fanglin.right.vo.DecorationFunctionRightVO;

public interface DecorationFunctionRightService {
	
	public List<DecorationFunctionRightVO> queryDecorationFunctionRightByName(DecorationFunctionRightVO decorationFunctionRightVO);
	
	public void updateDecorationFunctionRight(DecorationFunctionRightVO decorationFunctionRightVO, List<Long> dfids, int company);

}
