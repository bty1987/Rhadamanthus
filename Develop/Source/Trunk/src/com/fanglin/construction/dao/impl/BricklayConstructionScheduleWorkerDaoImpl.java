/**
 * @File Name		: BricklayConstructionScheduleWorkerDaoImpl.java
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

import com.fanglin.construction.dao.BricklayConstructionScheduleWorkerDao;
import com.fanglin.construction.po.BricklayConstructionScheduleWorkerPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("bricklayConstructionScheduleWorkerDao")
public class BricklayConstructionScheduleWorkerDaoImpl extends DaoImpl<BricklayConstructionScheduleWorkerPO> implements BricklayConstructionScheduleWorkerDao {
	
	public BricklayConstructionScheduleWorkerDaoImpl(){
		super(BricklayConstructionScheduleWorkerPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<BricklayConstructionScheduleWorkerPO> queryBricklayConstructionScheduleWorkerByOrderId(String orderId) {
		return session().createCriteria(BricklayConstructionScheduleWorkerPO.class).add(Restrictions.eq(BricklayConstructionScheduleWorkerPO.COLUMN_ORDERID_STR, orderId)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<BricklayConstructionScheduleWorkerPO> queryBricklayConstructionScheduleWorkerByBcsId(int bcsId){
		return session().createCriteria(BricklayConstructionScheduleWorkerPO.class).add(Restrictions.eq(BricklayConstructionScheduleWorkerPO.COLUMN_BCSID_STR, bcsId)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<BricklayConstructionScheduleWorkerPO> queryBricklayConstructionScheduleWorkerByBcsIdAWorkerId(int bcsId, String workerId){
		return session().createCriteria(BricklayConstructionScheduleWorkerPO.class)
				.add(Restrictions.eq(BricklayConstructionScheduleWorkerPO.COLUMN_BCSID_STR, bcsId))
				.add(Restrictions.eq(BricklayConstructionScheduleWorkerPO.COLUMN_WORKERID_STR, workerId))
				.list();
	}

}
