package com.fanglin.sales.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.sales.po.SalesPO;
import com.fanglin.utils.Paging;

public interface SalesDao extends Dao<SalesPO> {
	
	public List<SalesPO> pageSales(Paging paging, List<Filter> filter,int company,int uid);
	
	public List<SalesPO> pageSalesForAdvance(Paging paging, List<Filter> filter,int company);
	
	public List<SalesPO> pageSalesForBalance(Paging paging, List<Filter> filter,int company);
	
	public List<SalesPO> pageSalesForDompany(Paging paging, List<Filter> filter,int dompany);
	
	public List<SalesPO> pageSalesForBalanceByDompany(Paging paging, List<Filter> filter,int dompany);
	
	public List<SalesPO> pageSalesForPompany(Paging paging, List<Filter> filter,int pompany);
	
	public List<SalesPO> pageSalesForBalanceByPompany(Paging paging, List<Filter> filter,int pompany);
	
	public List<SalesPO> pageSalesForSupplier(Paging paging, List<Filter> filter,int company,int uid);
	
	public SalesPO querySalesByNo(String no);
	
	public List<SalesPO> querySalesByOrderId(String orderId);
	
	public List<Object> querySalesActivityByTotal(String orderId);
	
	public int countSalesByOrderId(String orderId, short status);
	
}
