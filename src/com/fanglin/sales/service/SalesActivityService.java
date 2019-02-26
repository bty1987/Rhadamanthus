package com.fanglin.sales.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.sales.vo.SalesActivityItemVO;
import com.fanglin.sales.vo.SalesVO;

public interface SalesActivityService {
	
	public int addSalesActivityItem(List<SalesActivityItemVO> salesActivityItems) throws FLException;
	
	public List<SalesActivityItemVO> querySalesActivityItem(String orderId);
	
	public Object querySalesActivity(String orderId);
	
	public int updateSalesForActivity(SalesVO salesVO) throws FLException;
	
	public int abateSalesActivityItem(SalesActivityItemVO salesActivityItemVO, String userId) throws FLException;

	public int receiveSalesActivityItem(SalesActivityItemVO salesActivityItemVO, String userId,String userName) throws FLException;
}
