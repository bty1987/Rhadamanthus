/**
 * @File Name		: CarpentConstructionScheduleWorkerDao.java
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

import com.fanglin.construction.po.CarpentConstructionScheduleWorkerPO;
import com.fanglin.core.dao.Dao;

public interface CarpentConstructionScheduleWorkerDao extends Dao<CarpentConstructionScheduleWorkerPO> {
	
	public List<CarpentConstructionScheduleWorkerPO> queryCarpentConstructionScheduleWorkerByOrderId(String orderId);
	
	public List<CarpentConstructionScheduleWorkerPO> queryCarpentConstructionScheduleWorkerByCcsId(int ccsId);
	
	public List<CarpentConstructionScheduleWorkerPO> queryCarpentConstructionScheduleWorkerByCssIdAWorkerId(int ccsId, String workerId);

}
