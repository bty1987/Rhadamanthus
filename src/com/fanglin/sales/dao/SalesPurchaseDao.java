package com.fanglin.sales.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.sales.po.SalesPurchasePO;

public interface SalesPurchaseDao extends Dao<SalesPurchasePO>{
	
	public List<SalesPurchasePO> querySalesPurchaseBySid(long sid);

}
