package com.fanglin.right.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.right.vo.DecorationFunctionRightVO;

public interface DecorationFunctionRightService {

	public List<DecorationFunctionRightVO> queryDecorationFunctionRightByName(DecorationFunctionRightVO decorationFunctionRightVO, int company);

	public void updateDecorationFunctionRight(DecorationFunctionRightVO decorationFunctionRightVO, List<Long> dfids, int company);

	public int syncDecorationFunctionRight(DecorationFunctionRightVO decorationFunctionRightVO, List<String> companys, Integer company) throws FLException;

}
