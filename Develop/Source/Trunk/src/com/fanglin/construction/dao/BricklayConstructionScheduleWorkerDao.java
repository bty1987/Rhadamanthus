/**
 * @File Name		: BricklayConstructionScheduleWorkerDao.java
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

import com.fanglin.construction.po.BricklayConstructionScheduleWorkerPO;
import com.fanglin.core.dao.Dao;

public interface BricklayConstructionScheduleWorkerDao extends Dao<BricklayConstructionScheduleWorkerPO> {
	
	public List<BricklayConstructionScheduleWorkerPO> queryBricklayConstructionScheduleWorkerByOrderId(String orderId);
	
	public List<BricklayConstructionScheduleWorkerPO> queryBricklayConstructionScheduleWorkerByBcsId(int bcsId);
	
	public List<BricklayConstructionScheduleWorkerPO> queryBricklayConstructionScheduleWorkerByBcsIdAWorkerId(int bcsId, String workerId);

}
