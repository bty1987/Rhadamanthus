/**
 * @File Name		: CarpentConstructionScheduleWorkerDaoImpl.java
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

import com.fanglin.construction.dao.CarpentConstructionScheduleWorkerDao;
import com.fanglin.construction.po.CarpentConstructionScheduleWorkerPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("carpentConstructionScheduleWorkerDao")
public class CarpentConstructionScheduleWorkerDaoImpl extends DaoImpl<CarpentConstructionScheduleWorkerPO> implements CarpentConstructionScheduleWorkerDao {
	
	public CarpentConstructionScheduleWorkerDaoImpl(){
		super(CarpentConstructionScheduleWorkerPO.class);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<CarpentConstructionScheduleWorkerPO> queryCarpentConstructionScheduleWorkerByOrderId(String orderId) {
		return session().createCriteria(CarpentConstructionScheduleWorkerPO.class).add(Restrictions.eq(CarpentConstructionScheduleWorkerPO.COLUMN_ORDERID_STR, orderId)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<CarpentConstructionScheduleWorkerPO> queryCarpentConstructionScheduleWorkerByCcsId(int ccsId){
		return session().createCriteria(CarpentConstructionScheduleWorkerPO.class).add(Restrictions.eq(CarpentConstructionScheduleWorkerPO.COLUMN_CCSID_STR, ccsId)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<CarpentConstructionScheduleWorkerPO> queryCarpentConstructionScheduleWorkerByCssIdAWorkerId(int ccsId, String workerId){
		return session().createCriteria(CarpentConstructionScheduleWorkerPO.class)
				.add(Restrictions.eq(CarpentConstructionScheduleWorkerPO.COLUMN_CCSID_STR, ccsId))
				.add(Restrictions.eq(CarpentConstructionScheduleWorkerPO.COLUMN_WORKERID_STR, workerId))
				.list();
	}
}
