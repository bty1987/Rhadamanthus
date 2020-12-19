package com.fanglin.sales.dao;
import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.sales.po.SalesFunctionPO;
public interface SalesFunctionDao extends Dao<SalesFunctionPO>{
	
	public List<SalesFunctionPO> querySalesFunction(Short type);
	
	public List<SalesFunctionPO> querySalesFunctionByName(String name);
	
}

