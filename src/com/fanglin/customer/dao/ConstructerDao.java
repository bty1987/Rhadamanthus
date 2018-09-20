package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.construction.po.ConstructerPO;
import com.fanglin.core.dao.Dao;

public interface ConstructerDao extends Dao<ConstructerPO> {
	
	public List<ConstructerPO> queryCusConstructer(String orderId);

}
