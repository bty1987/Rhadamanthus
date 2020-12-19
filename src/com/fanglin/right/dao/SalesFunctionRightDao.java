package com.fanglin.right.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.right.po.SalesFunctionRightPO;

public interface SalesFunctionRightDao extends Dao<SalesFunctionRightPO>{
	
	public List<SalesFunctionRightPO> querySalesFunctionRightByName(String name);
	
	public int deleteSalesFunctionRightByName(String name);
}
