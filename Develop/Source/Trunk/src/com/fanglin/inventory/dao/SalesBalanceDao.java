package com.fanglin.inventory.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.inventory.po.SalesBalancePO;
import com.fanglin.utils.Paging;

public interface SalesBalanceDao extends Dao<SalesBalancePO>{
	
	public List<SalesBalancePO> pageSalesBalance(Paging paging, List<Filter> filter);
	
}
