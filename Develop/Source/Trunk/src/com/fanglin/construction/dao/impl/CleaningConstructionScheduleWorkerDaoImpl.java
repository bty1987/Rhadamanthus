/**
 * @File Name		: CleaningConstructionScheduleWorkerDaoImpl.java
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

import com.fanglin.construction.dao.CleaningConstructionScheduleWorkerDao;
import com.fanglin.construction.po.CleaningConstructionScheduleWorkerPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("cleaningConstructionScheduleWorkerDao")
public class CleaningConstructionScheduleWorkerDaoImpl extends DaoImpl<CleaningConstructionScheduleWorkerPO> implements CleaningConstructionScheduleWorkerDao {
	
	public CleaningConstructionScheduleWorkerDaoImpl(){
		super(CleaningConstructionScheduleWorkerPO.class);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<CleaningConstructionScheduleWorkerPO> queryCleaningConstructionScheduleWorkerByOrderId(String orderId) {
		return session().createCriteria(CleaningConstructionScheduleWorkerPO.class).add(Restrictions.eq(CleaningConstructionScheduleWorkerPO.COLUMN_ORDERID_STR, orderId)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<CleaningConstructionScheduleWorkerPO> queryCleaningConstructionScheduleWorkerByCcsId(int ccsId){
		return session().createCriteria(CleaningConstructionScheduleWorkerPO.class).add(Restrictions.eq(CleaningConstructionScheduleWorkerPO.COLUMN_CCSID_STR, ccsId)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<CleaningConstructionScheduleWorkerPO> queryCleaningConstructionScheduleWorkerByCcsIdAWorkerId(int ccsId, String workerId){
		return session().createCriteria(CleaningConstructionScheduleWorkerPO.class)
				.add(Restrictions.eq(CleaningConstructionScheduleWorkerPO.COLUMN_CCSID_STR, ccsId))
				.add(Restrictions.eq(CleaningConstructionScheduleWorkerPO.COLUMN_WORKERID_STR, workerId))
				.list();
	}

}
