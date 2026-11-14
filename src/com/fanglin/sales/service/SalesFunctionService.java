package com.fanglin.sales.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.sales.vo.SalesFunctionVO;
import com.fanglin.utils.Paging;

public interface SalesFunctionService {

	public List<SalesFunctionVO> querySalesFunction(SalesFunctionVO salesFunctionVO);

	public List<SalesFunctionVO> querySalesFunctionByName(SalesFunctionVO salesFunctionVO);

	public List<SalesFunctionVO> pageSalesFunction(Paging paging, List<Filter> filters);

	public int addSalesFunction(SalesFunctionVO salesFunctionVO) throws FLException;

	public int updateSalesFunction(SalesFunctionVO salesFunctionVO) throws FLException;

	public int deleteSalesFunction(SalesFunctionVO salesFunctionVO) throws FLException;
}
