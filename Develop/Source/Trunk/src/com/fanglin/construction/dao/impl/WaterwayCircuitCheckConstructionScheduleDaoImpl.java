/**
 * @File Name		: WaterwayCircuitCheckConstructionScheduleDaoImpl.java
 * @Package   	: com.fanglin.dao.constructionSchedule.impl
 * @Version		: 1.0
 * @Date			: 2015-4-9
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.construction.dao.WaterwayCircuitCheckConstructionScheduleDao;
import com.fanglin.construction.po.WaterwayCircuitCheckConstructionSchedulePO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("waterwayCircuitCheckConstructionScheduleDao")
public class WaterwayCircuitCheckConstructionScheduleDaoImpl extends DaoImpl<WaterwayCircuitCheckConstructionSchedulePO> implements WaterwayCircuitCheckConstructionScheduleDao {
	
	public WaterwayCircuitCheckConstructionScheduleDaoImpl(){
		super(WaterwayCircuitCheckConstructionSchedulePO.class);
	}

	@Override
	public WaterwayCircuitCheckConstructionSchedulePO queryWaterwayCircuitCheckConstructionScheduleByOrderId(String orderId){
		return (WaterwayCircuitCheckConstructionSchedulePO) session().createCriteria(WaterwayCircuitCheckConstructionSchedulePO.class).add(Restrictions.eq(WaterwayCircuitCheckConstructionSchedulePO.COLUMN_ORDERID_STR, orderId)).uniqueResult();
	}

	@Override
	public WaterwayCircuitCheckConstructionSchedulePO queryWaterwayCircuitCheckConstructionScheduleByCsId(long csId){
		return (WaterwayCircuitCheckConstructionSchedulePO) session().createCriteria(WaterwayCircuitCheckConstructionSchedulePO.class).add(Restrictions.eq(WaterwayCircuitCheckConstructionSchedulePO.COLUMN_CSID_STR, csId)).uniqueResult();
	}

}
