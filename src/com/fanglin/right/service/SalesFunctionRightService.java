package com.fanglin.right.service;

import java.util.List;

import com.fanglin.right.vo.SalesFunctionRightVO;

public interface SalesFunctionRightService {
	
	public List<SalesFunctionRightVO> querySalesFunctionRightByName(SalesFunctionRightVO salesFunctionRightVO);
	
	public void updateSalesFunctionRight(SalesFunctionRightVO salesFunctionRightVO, List<Long> sfids, int company);
	
}
