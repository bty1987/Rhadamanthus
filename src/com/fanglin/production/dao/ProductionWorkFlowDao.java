package com.fanglin.production.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.production.po.ProductionWorkFlowPO;

public interface ProductionWorkFlowDao extends Dao<ProductionWorkFlowPO>{
	
     public List<ProductionWorkFlowPO> queryProductionWorkFlowByPwpid(long pwpid);
     
     public ProductionWorkFlowPO queryProductionWorkFlowByPwpidAWfid(long pwpid,long wfid);
}
