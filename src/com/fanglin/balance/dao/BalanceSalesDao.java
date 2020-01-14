package com.fanglin.balance.dao;

import java.util.List;

import com.fanglin.balance.po.BalanceSalesPO;
import com.fanglin.core.dao.Dao;

public interface BalanceSalesDao extends Dao<BalanceSalesPO> {
	
	public List<BalanceSalesPO> queryBalanceSalesForSales(long bid);
	
	public List<BalanceSalesPO> queryBalanceSalesForBalance(long bsid);
	
}
