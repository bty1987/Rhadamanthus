package com.fanglin.construction.dao;

import java.util.List;

import com.fanglin.construction.po.ConstructerPO;
import com.fanglin.core.dao.Dao;

public interface ConstructerDao extends Dao<ConstructerPO>{

	public List<ConstructerPO> queryConstructerByOrderId(String orderId, Integer schedule);

	public List<ConstructerPO> queryConstructerByCid(long cid, Integer schedule);

	public ConstructerPO queryConstructerByCrId(long crid);
	
	public int countConstructer(long cid, String userId, int schedule, short status);

}
