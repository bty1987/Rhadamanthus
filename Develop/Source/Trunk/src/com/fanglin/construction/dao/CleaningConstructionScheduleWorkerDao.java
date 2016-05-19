/**
 * @File Name		: CleaningConstructionScheduleWorkerDao.java
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

import com.fanglin.construction.po.CleaningConstructionScheduleWorkerPO;
import com.fanglin.core.dao.Dao;

public interface CleaningConstructionScheduleWorkerDao extends Dao<CleaningConstructionScheduleWorkerPO> {
	
	public List<CleaningConstructionScheduleWorkerPO> queryCleaningConstructionScheduleWorkerByOrderId(String orderId);
	
	public List<CleaningConstructionScheduleWorkerPO> queryCleaningConstructionScheduleWorkerByCcsId(int ccsId);
	
	public List<CleaningConstructionScheduleWorkerPO> queryCleaningConstructionScheduleWorkerByCcsIdAWorkerId(int ccsId, String workerId);

}
