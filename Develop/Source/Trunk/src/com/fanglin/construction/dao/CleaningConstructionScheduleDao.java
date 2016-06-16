/**
 * @File Name		: CleaningConstructionScheduleDao.java
 * @Package   	: com.fanglin.dao.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.dao;

import com.fanglin.construction.po.CleaningConstructionSchedulePO;
import com.fanglin.core.dao.Dao;

public interface CleaningConstructionScheduleDao extends Dao<CleaningConstructionSchedulePO> {
	
	public CleaningConstructionSchedulePO queryCleaningConstructionScheduleByOrderId(String orderId);
	
	public CleaningConstructionSchedulePO queryCleaningConstructionScheduleByCsId(int csId);
	
}
