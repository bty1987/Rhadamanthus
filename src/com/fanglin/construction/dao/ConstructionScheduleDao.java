package com.fanglin.construction.dao;

import java.util.List;

import com.fanglin.construction.po.ConstructionSchedulePO;
import com.fanglin.core.dao.Dao;

public interface ConstructionScheduleDao extends Dao<ConstructionSchedulePO>{

	public List<ConstructionSchedulePO> queryConstructionScheduleByOrderId(String orderId, Short schedule);
	
	public List<ConstructionSchedulePO> queryConstructionScheduleByCid(Long cid, Short schedule);

}
