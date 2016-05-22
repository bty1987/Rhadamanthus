/**
 * @File Name		: OilConstructionScheduleWorkerDaoImpl.java
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

import com.fanglin.construction.dao.OilConstructionScheduleWorkerDao;
import com.fanglin.construction.po.OilConstructionScheduleWorkerPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("oilConstructionScheduleWorkerDao")
public class OilConstructionScheduleWorkerDaoImpl extends DaoImpl<OilConstructionScheduleWorkerPO> implements OilConstructionScheduleWorkerDao {
	
	public OilConstructionScheduleWorkerDaoImpl(){
		super(OilConstructionScheduleWorkerPO.class);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<OilConstructionScheduleWorkerPO> queryOilConstructionScheduleWorkerByOrderId(String orderId) {
		return session().createCriteria(OilConstructionScheduleWorkerPO.class).add(Restrictions.eq(OilConstructionScheduleWorkerPO.COLUMN_ORDERID_STR, orderId)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<OilConstructionScheduleWorkerPO> queryOilConstructionScheduleWorkerByOcsId(int ocsId){
		return session().createCriteria(OilConstructionScheduleWorkerPO.class).add(Restrictions.eq(OilConstructionScheduleWorkerPO.COLUMN_OCSID_STR, ocsId)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<OilConstructionScheduleWorkerPO> queryOilConstructionScheduleWorkerByOcsIdAWorkerId(int ocsId, String workerId){
		return session().createCriteria(OilConstructionScheduleWorkerPO.class)
				.add(Restrictions.eq(OilConstructionScheduleWorkerPO.COLUMN_OCSID_STR, ocsId))
				.add(Restrictions.eq(OilConstructionScheduleWorkerPO.COLUMN_WORKERID_STR, workerId))
				.list();
	}

}
