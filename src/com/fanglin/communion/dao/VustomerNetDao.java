package com.fanglin.communion.dao;

import java.util.List;

import com.fanglin.communion.po.VustomerNetPO;
import com.fanglin.core.dao.Dao;

public interface VustomerNetDao extends Dao<VustomerNetPO> {
	 
	public List<?> countByUnionId(String unionId);
	
	public VustomerNetPO queryVustomerNet(String unionId, String netunionId);
	
}
