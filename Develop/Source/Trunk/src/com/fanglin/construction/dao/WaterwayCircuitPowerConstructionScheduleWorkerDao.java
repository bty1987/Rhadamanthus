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

import com.fanglin.construction.po.WaterwayCircuitPowerConstructionScheduleWorkerPO;
import com.fanglin.core.dao.Dao;

public interface WaterwayCircuitPowerConstructionScheduleWorkerDao extends Dao<WaterwayCircuitPowerConstructionScheduleWorkerPO> {
	
	public List<WaterwayCircuitPowerConstructionScheduleWorkerPO> queryWaterwayCircuitPowerConstructionScheduleWorkerByOrderId(String orderId);
	
	public List<WaterwayCircuitPowerConstructionScheduleWorkerPO> queryWaterwayCircuitPowerConstructionScheduleWorkerByWcpcsId(int wcpcsId);
	
	public List<WaterwayCircuitPowerConstructionScheduleWorkerPO> queryWaterwayCircuitPowerConstructionScheduleWorkerByWcpcsIdAWorderId(int wcpcsId, String workerId);

}
