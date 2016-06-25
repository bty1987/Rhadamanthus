/**
 * @File Name		: WaterWaycircuitPowerConstructionScheduleWorkerDao.java
 * @Package   	: com.fanglin.dao.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-11-18
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.dao;

import java.util.List;

import com.fanglin.construction.po.WaterwayCircuitCheckConstructionScheduleWorkerPO;
import com.fanglin.core.dao.Dao;

public interface WaterwayCircuitCheckConstructionScheduleWorkerDao extends Dao<WaterwayCircuitCheckConstructionScheduleWorkerPO> {
	
	public List<WaterwayCircuitCheckConstructionScheduleWorkerPO> queryWaterwayCircuitCheckConstructionScheduleWorkerByOrderId(String orderId);
	
	public List<WaterwayCircuitCheckConstructionScheduleWorkerPO> queryWaterwayCircuitCheckConstructionScheduleWorkerByWcccsId(int wcccsId);
	
	public List<WaterwayCircuitCheckConstructionScheduleWorkerPO> queryWaterwayCircuitCheckConstructionScheduleWorkerByWcccsIdAWorderId(int wcccsId, String workerId);

}
