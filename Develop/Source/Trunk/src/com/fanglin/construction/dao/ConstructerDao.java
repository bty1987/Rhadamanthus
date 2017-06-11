package com.fanglin.construction.dao;

import java.util.List;

import com.fanglin.construction.po.ConstructerPO;
import com.fanglin.core.dao.Dao;

public interface ConstructerDao extends Dao<ConstructerPO>{

	public List<ConstructerPO> queryConstructerByOrderId(String orderId, Integer schedule);

	public List<ConstructerPO> queryConstructerByCsId(long csId, Integer schedule);

	public ConstructerPO queryConstructerByCid(long cid);
	
	public int countConstructer(long csId, String userId, int schedule, short status);

}
