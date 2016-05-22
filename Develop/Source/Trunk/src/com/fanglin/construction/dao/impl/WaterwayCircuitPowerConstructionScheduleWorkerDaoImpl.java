/**
 * @File Name		: WaterWaycircuitPowerConstructionScheduleWorkerDaoImpl.java
 * @Package   	: com.fanglin.dao.impl.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-11-18
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.construction.dao.WaterwayCircuitPowerConstructionScheduleWorkerDao;
import com.fanglin.construction.po.WaterwayCircuitPowerConstructionScheduleWorkerPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("waterWaycircuitPowerConstructionScheduleWorkerDao")
public class WaterwayCircuitPowerConstructionScheduleWorkerDaoImpl extends DaoImpl<WaterwayCircuitPowerConstructionScheduleWorkerPO> implements WaterwayCircuitPowerConstructionScheduleWorkerDao {
	
	public WaterwayCircuitPowerConstructionScheduleWorkerDaoImpl(){
		super(WaterwayCircuitPowerConstructionScheduleWorkerPO.class);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<WaterwayCircuitPowerConstructionScheduleWorkerPO> queryWaterwayCircuitPowerConstructionScheduleWorkerByOrderId(String orderId) {
		return session().createCriteria(WaterwayCircuitPowerConstructionScheduleWorkerPO.class).add(Restrictions.eq(WaterwayCircuitPowerConstructionScheduleWorkerPO.COLUMN_ORDERID_STR, orderId)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<WaterwayCircuitPowerConstructionScheduleWorkerPO> queryWaterwayCircuitPowerConstructionScheduleWorkerByWcpcsId(int wcpcsId){
		return session().createCriteria(WaterwayCircuitPowerConstructionScheduleWorkerPO.class).add(Restrictions.eq(WaterwayCircuitPowerConstructionScheduleWorkerPO.COLUMN_WCPCSID_STR, wcpcsId)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<WaterwayCircuitPowerConstructionScheduleWorkerPO> queryWaterwayCircuitPowerConstructionScheduleWorkerByWcpcsIdAWorderId(int wcpcsId, String workerId){
		return session().createCriteria(WaterwayCircuitPowerConstructionScheduleWorkerPO.class)
				.add(Restrictions.eq(WaterwayCircuitPowerConstructionScheduleWorkerPO.COLUMN_WCPCSID_STR, wcpcsId))
				.add(Restrictions.eq(WaterwayCircuitPowerConstructionScheduleWorkerPO.COLUMN_WORKERID_STR, workerId))
				.list();
	}

}
