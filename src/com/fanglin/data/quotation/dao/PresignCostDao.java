package com.fanglin.data.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.data.po.PresignCostPO;

public interface PresignCostDao extends Dao<PresignCostPO> {
	
	public List<PresignCostPO> queryPresignCost(Long ppid);
	
}
