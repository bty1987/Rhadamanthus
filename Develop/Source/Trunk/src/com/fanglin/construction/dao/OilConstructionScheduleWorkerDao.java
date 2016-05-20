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

import com.fanglin.construction.po.OilConstructionScheduleWorkerPO;
import com.fanglin.core.dao.Dao;

public interface OilConstructionScheduleWorkerDao extends Dao<OilConstructionScheduleWorkerPO> {
	
	public List<OilConstructionScheduleWorkerPO> queryOilConstructionScheduleWorkerByOrderId(String orderId);
	
	public List<OilConstructionScheduleWorkerPO> queryOilConstructionScheduleWorkerByOcsId(int ocsId);
	
	public List<OilConstructionScheduleWorkerPO> queryOilConstructionScheduleWorkerByOcsIdAWorkerId(int ocsId, String workerId);

}
