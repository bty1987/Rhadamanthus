package com.fanglin.sales.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.sales.vo.SalesItemVO;
import com.fanglin.sales.vo.SalesVO;
import com.fanglin.utils.Paging;

public interface SalesService {
	
	public void pageSales(Paging paging,List<Filter> filter,String userId,int company);
	
	public void pageSalesForAdvance(Paging paging,List<Filter> filter,String userId,int company);
	
	public void pageSalesForBalance(Paging paging,List<Filter> filter,String userId,int company);
	
	public void pageSalesForDompany(Paging paging,List<Filter> filter,String userId,int dompany);
	
	public SalesVO querySalesBySid(SalesVO salesVO) throws FLException;
	
	public SalesVO querySalesByNo(SalesVO salesVO) throws FLException;
	
	public int addSales(SalesVO salesVO,List<SalesItemVO> salesItemVOs,int company) throws FLException;
	
	public int updateSalesForCoupon(SalesVO salesVO) throws FLException;
	
	public int updateSalesForMaling(SalesVO salesVO) throws FLException;
	
}
