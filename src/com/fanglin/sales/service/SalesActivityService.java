package com.fanglin.sales.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.sales.vo.SalesActivityItemVO;

public interface SalesActivityService {
	
	public int addSalesActivityItem(List<SalesActivityItemVO> salesActivityItems) throws FLException;
	
	public List<SalesActivityItemVO> querySalesActivityItem(String orderId);
	
	public Object querySalesActivity(String orderId);
	
	public int abateSalesActivityItem(SalesActivityItemVO salesActivityItemVO, String userId) throws FLException;

	public int receiveSalesActivityItem(SalesActivityItemVO salesActivityItemVO, String userId,String userName) throws FLException;
	
	//配送销售活动项
	public void deliveSalesActivityItem(SalesActivityItemVO salesActivityItemVO, String userId,String userName) throws FLException;
	
	//未退装修活动 , 已审批未退货
	public void unrefundSalesActivityItem(SalesActivityItemVO salesActivityItemVO) throws FLException;
	
	//退货销售活动项
	public void refundSalesActivityItem(SalesActivityItemVO salesActivityItemVO, String userId) throws FLException;
	
	//消耗销售活动项
	public void expendSalesActivityItem(SalesActivityItemVO salesActivityItemVO) throws FLException;
	
}
