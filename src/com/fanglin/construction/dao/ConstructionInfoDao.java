package com.fanglin.construction.dao;

import com.fanglin.construction.po.ConstructionInfoPO;
import com.fanglin.core.dao.Dao;
public interface ConstructionInfoDao extends Dao<ConstructionInfoPO>{
	
	public ConstructionInfoPO queryConstructionInfo(long  cid);
	
	public ConstructionInfoPO queryConstructionInfoByOrderId(String orderId);
	
}
