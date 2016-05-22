/**
 * @File Name		: PutlineConstructionScheduleDao.java
 * @Package   	: com.fanglin.dao.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-10-2
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.dao;

import com.fanglin.construction.po.PutlineConstructionSchedulePO;
import com.fanglin.core.dao.Dao;

public interface PutlineConstructionScheduleDao extends Dao<PutlineConstructionSchedulePO>{
	
	public PutlineConstructionSchedulePO queryConstructionScheduleByOrderId(String orderId);
	
	public PutlineConstructionSchedulePO queryConstructionScheduleByCsId(int csId); 

}
