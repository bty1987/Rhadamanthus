package com.fanglin.production.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.production.po.ProductionUserWorkFlowPO;

public interface ProductionUserWorkFlowDao extends Dao<ProductionUserWorkFlowPO>{
	
	public List<ProductionUserWorkFlowPO> queryProductionUserWorkFlowByPwfid(long pwfid);
}
