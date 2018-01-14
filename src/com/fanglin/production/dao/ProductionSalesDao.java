package com.fanglin.production.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;

import com.fanglin.production.po.ProductionSalesPO;

public interface ProductionSalesDao extends Dao<ProductionSalesPO>{
	
	public List<ProductionSalesPO> queryProductionSalesByPid(long pid);

}
