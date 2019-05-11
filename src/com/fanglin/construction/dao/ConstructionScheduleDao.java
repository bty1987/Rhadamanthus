package com.fanglin.construction.dao;

import java.util.List;

import com.fanglin.construction.po.ConstructionSchedulePO;
import com.fanglin.core.dao.Dao;

public interface ConstructionScheduleDao extends Dao<ConstructionSchedulePO>{
	
	public List<ConstructionSchedulePO> queryConstructionScheduleByOrderId(String orderId);
	
	public List<ConstructionSchedulePO> queryConstructionScheduleByCid(Long cid);
	
	public ConstructionSchedulePO queryConstructionScheduleByOrderId(String orderId, short schedule);
	
	public ConstructionSchedulePO queryConstructionScheduleByCid(long cid, short schedule);

}
