package com.fanglin.sales.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.sales.vo.SalesRefundsItemVO;
import com.fanglin.sales.vo.SalesRefundsVO;
import com.fanglin.utils.Paging;

public interface SalesRefundsService {

	public void pageSalesRefunds(Paging paging, List<Filter> filters) throws FLException;

	public List<SalesRefundsVO> querySalesRefundsBySid(SalesRefundsVO refundsVO);

	public List<SalesRefundsItemVO> querySalesRefundsItemBySid(SalesRefundsVO refundsVO);

	public List<SalesRefundsItemVO> querySalesRefundsItemByRid(SalesRefundsVO refundsVO);

	public int sendSalesRefunds(SalesRefundsVO refundsVO) throws FLException;

	public int affirmSalesRefunds(SalesRefundsVO refundsVO) throws FLException;

}
