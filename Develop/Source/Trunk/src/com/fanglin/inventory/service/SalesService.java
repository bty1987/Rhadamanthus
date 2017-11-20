package com.fanglin.inventory.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.inventory.po.SalesPO;
import com.fanglin.inventory.vo.SalesItemVO;
import com.fanglin.inventory.vo.SalesVO;
import com.fanglin.utils.Paging;

public interface SalesService {
	
	public void pageSales(Paging paging,List<Filter> filter,String userId,int company);
	
	public void pageSalesForAdvance(Paging paging,List<Filter> filter,String userId,int company);
	
	public void pageSalesForBalance(Paging paging,List<Filter> filter,String userId,int company);
	
	public SalesVO querySalesBySid(SalesVO salesVO) throws FLException;
	
	public SalesVO querySalesByNo(SalesVO salesVO) throws FLException;
	
	public int addSales(SalesVO salesVO,List<SalesItemVO> salesItemVOs,int company) throws FLException;
	
	public int updateSalesForCoupon(SalesVO salesVO) throws FLException;
	
	public int updateSalesForMaling(SalesVO salesVO) throws FLException;
	
	public int updateSalesForPaymentStatus(SalesVO salesVO) throws FLException;
	
	public int updateSalesConfirmSalesPaymentStatus(List<SalesVO> salesVOs) throws FLException;
	
	public int updateSalesStatusWaste(SalesPO salesPO) throws FLException;
	
}
