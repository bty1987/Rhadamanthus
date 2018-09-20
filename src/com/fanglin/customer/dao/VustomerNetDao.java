package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.customer.po.VustomerNetPO;

public interface VustomerNetDao extends Dao<VustomerNetPO> {
	 
	public List<?> countByUnionId(String unionId);
	
	public VustomerNetPO queryVustomerNet(String unionId, String netunionId);
	
}
