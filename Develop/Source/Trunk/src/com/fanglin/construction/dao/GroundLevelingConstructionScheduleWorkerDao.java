/**
 * @File Name		: OilConstructionScheduleWorkerDao.java
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

import com.fanglin.construction.po.GroundLevelingConstructionScheduleWorkerPO;
import com.fanglin.core.dao.Dao;

public interface GroundLevelingConstructionScheduleWorkerDao extends Dao<GroundLevelingConstructionScheduleWorkerPO> {
	
	public List<GroundLevelingConstructionScheduleWorkerPO> queryGroundLevelingConstructionScheduleWorkerByOrderId(String orderId);
	
	public List<GroundLevelingConstructionScheduleWorkerPO> queryGroundLevelingConstructionScheduleWorkerByGlcsId(int glcsId);
	
	public List<GroundLevelingConstructionScheduleWorkerPO> queryGroundLevelingConstructionScheduleWorkerByGlcsIdAWorkerId(int glcsId, String workerId);

}
