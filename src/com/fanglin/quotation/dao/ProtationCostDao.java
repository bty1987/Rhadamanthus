package com.fanglin.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.quotation.po.ProtationCostPO;

public interface ProtationCostDao extends Dao<ProtationCostPO> {
	
	public List<ProtationCostPO> queryProtationCost(Long pid);
	
}
