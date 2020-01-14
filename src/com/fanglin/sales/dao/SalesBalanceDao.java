package com.fanglin.sales.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.sales.po.SalesBalancePO;
import com.fanglin.utils.Paging;

public interface SalesBalanceDao extends Dao<SalesBalancePO>{
	
	public List<SalesBalancePO> pageSalesBalance(Paging paging, List<Filter> filter,int company);
	
	public List<SalesBalancePO> pageSalesBalanceForDompany(Paging paging, List<Filter> filter,int dompany);
	
	public List<SalesBalancePO> pageSalesBalanceForPompany(Paging paging, List<Filter> filter,int pompany);
	
	public List<SalesBalancePO> pageSalesBalanceForSupplier(Paging paging, List<Filter> filter,int pompany, int uid);
}
