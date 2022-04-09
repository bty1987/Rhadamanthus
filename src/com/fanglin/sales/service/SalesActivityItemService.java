package com.fanglin.sales.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.sales.vo.SalesActivityItemVO;
import com.fanglin.sales.vo.SalesActivityVO;

public interface SalesActivityItemService {

	public List<SalesActivityItemVO> querySalesActivityItem(String orderId);

	public int addSalesActivityItem(SalesActivityVO salesActivityVO, List<SalesActivityItemVO> salesActivityItems, String userId) throws FLException;

	public int abateSalesActivityItem(SalesActivityItemVO salesActivityItemVO, String userId) throws FLException;

	public int receiveSalesActivityItem(SalesActivityItemVO salesActivityItemVO, String userId, String userName) throws FLException;

	public void deliveSalesActivityItem(SalesActivityItemVO salesActivityItemVO, String userId, String userName) throws FLException;

	public void unrefundSalesActivityItem(SalesActivityItemVO salesActivityItemVO, String userId) throws FLException;

	public void refundSalesActivityItem(SalesActivityItemVO salesActivityItemVO, String userId) throws FLException;

	public void expendSalesActivityItem(SalesActivityItemVO salesActivityItemVO, String userId) throws FLException;
	
	public void discountSalesActivityItem(SalesActivityItemVO salesActivityItemVO, String userId) throws FLException;

	public void sendSalesActivityItem(SalesActivityItemVO salesActivityItemVO) throws FLException;

	public int affirmSalesActivityItem(List<SalesActivityItemVO> salesActivityItems) throws FLException;
}
