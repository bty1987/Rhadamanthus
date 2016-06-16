/**
 * @File Name		: OilConstructionScheduleDao.java
 * @Package   	: com.fanglin.dao.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.dao;

import com.fanglin.construction.po.GroundLevelingConstructionSchedulePO;
import com.fanglin.core.dao.Dao;

public interface GroundLevelingConstructionScheduleDao extends Dao<GroundLevelingConstructionSchedulePO> {
	
	public GroundLevelingConstructionSchedulePO queryGroundLevelingConstructionScheduleByOrderId(String orderId);
	
	public GroundLevelingConstructionSchedulePO queryGroundLevelingConstructionScheduleByCsId(int csId);

}
