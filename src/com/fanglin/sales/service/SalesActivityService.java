package com.fanglin.sales.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.sales.vo.SalesActivityVO;
import com.fanglin.utils.Paging;

public interface SalesActivityService {

	public void pageSalesActivity(Paging paging, List<Filter> filter, String orderId) throws FLException;

	public List<SalesActivityVO> amountSalesActivity(String orderId);

	public int amountSalesActivityForActivity(SalesActivityVO salesActivityVO);

	public int amountSalesActivityForPayment(SalesActivityVO salesActivityVO);

	public int checkSalesActivity(String orderId, long integral) throws FLException;

	public int checkSalesActivity(long sid, long integral) throws FLException;

}
