/**
 * @File Name		: WaterwayCircuitCheckConstructionScheduleWorkerDaoImpl.java
 * @Package   	: com.fanglin.dao.constructionSchedule.impl
 * @Version		: 1.0
 * @Date			: 2015-4-9
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.construction.dao.WaterwayCircuitCheckConstructionScheduleWorkerDao;
import com.fanglin.construction.po.WaterwayCircuitCheckConstructionScheduleWorkerPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("waterwayCircuitCheckConstructionScheduleWorkerDao")
public class WaterwayCircuitCheckConstructionScheduleWorkerDaoImpl extends DaoImpl<WaterwayCircuitCheckConstructionScheduleWorkerPO> implements WaterwayCircuitCheckConstructionScheduleWorkerDao {
	
	public WaterwayCircuitCheckConstructionScheduleWorkerDaoImpl(){
		super(WaterwayCircuitCheckConstructionScheduleWorkerPO.class);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<WaterwayCircuitCheckConstructionScheduleWorkerPO> queryWaterwayCircuitCheckConstructionScheduleWorkerByOrderId(String orderId) {
		return session().createCriteria(WaterwayCircuitCheckConstructionScheduleWorkerPO.class).add(Restrictions.eq(WaterwayCircuitCheckConstructionScheduleWorkerPO.COLUMN_ORDERID_STR, orderId)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<WaterwayCircuitCheckConstructionScheduleWorkerPO> queryWaterwayCircuitCheckConstructionScheduleWorkerByWcccsId(int wcccsId){
		return session().createCriteria(WaterwayCircuitCheckConstructionScheduleWorkerPO.class).add(Restrictions.eq(WaterwayCircuitCheckConstructionScheduleWorkerPO.COLUMN_WCCCSID_STR, wcccsId)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<WaterwayCircuitCheckConstructionScheduleWorkerPO> queryWaterwayCircuitCheckConstructionScheduleWorkerByWcccsIdAWorderId(int wcccsId, String workerId){
		return session().createCriteria(WaterwayCircuitCheckConstructionScheduleWorkerPO.class)
				.add(Restrictions.eq(WaterwayCircuitCheckConstructionScheduleWorkerPO.COLUMN_WCCCSID_STR, wcccsId))
				.add(Restrictions.eq(WaterwayCircuitCheckConstructionScheduleWorkerPO.COLUMN_WORKERID_STR, workerId))
				.list();
	}

}
