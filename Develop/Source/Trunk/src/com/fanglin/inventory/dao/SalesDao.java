package com.fanglin.inventory.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.inventory.po.SalesPO;
import com.fanglin.utils.Paging;

public interface SalesDao extends Dao<SalesPO> {
	
	public List<SalesPO> pageSales(Paging paging, List<Filter> filter,int company,int uid);
	
	public List<SalesPO> pageSalesForAdvance(Paging paging, List<Filter> filter,int company);
	
	public List<SalesPO> pageSalesForBalance(Paging paging, List<Filter> filter,int company);
	
	public SalesPO querySalesBySid(Long sid);
	
	public SalesPO querySalesByNo(String no);
	
	public List<SalesPO> querySalesByOrderId(String orderId);
	
}
