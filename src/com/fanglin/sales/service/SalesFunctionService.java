package com.fanglin.sales.service;

import java.util.List;

import com.fanglin.sales.vo.SalesFunctionVO;

public interface SalesFunctionService {

	public List<SalesFunctionVO> querySalesFunction(SalesFunctionVO salesFunctionVO);
	
	public List<SalesFunctionVO> querySalesFunctionByName(SalesFunctionVO salesFunctionVO);
}
