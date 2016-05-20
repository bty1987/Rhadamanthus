/**
 * @File Name		: GroundLevelingConstructionScheduleWorkerDaoImpl.java
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

import com.fanglin.construction.dao.GroundLevelingConstructionScheduleWorkerDao;
import com.fanglin.construction.po.GroundLevelingConstructionScheduleWorkerPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("groundLevelingConstructionScheduleWorkerDao")
public class GroundLevelingConstructionScheduleWorkerDaoImpl extends DaoImpl<GroundLevelingConstructionScheduleWorkerPO> implements GroundLevelingConstructionScheduleWorkerDao {
	
	public GroundLevelingConstructionScheduleWorkerDaoImpl(){
		super(GroundLevelingConstructionScheduleWorkerPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<GroundLevelingConstructionScheduleWorkerPO> queryGroundLevelingConstructionScheduleWorkerByOrderId(String orderId) {
		return session().createCriteria(GroundLevelingConstructionScheduleWorkerPO.class).add(Restrictions.eq(GroundLevelingConstructionScheduleWorkerPO.COLUMN_ORDERID_STR, orderId)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<GroundLevelingConstructionScheduleWorkerPO> queryGroundLevelingConstructionScheduleWorkerByGlcsId(int glcsId){
		return session().createCriteria(GroundLevelingConstructionScheduleWorkerPO.class).add(Restrictions.eq(GroundLevelingConstructionScheduleWorkerPO.COLUMN_GLCSID_STR, glcsId)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<GroundLevelingConstructionScheduleWorkerPO> queryGroundLevelingConstructionScheduleWorkerByGlcsIdAWorkerId(int glcsId, String workerId){
		return session().createCriteria(GroundLevelingConstructionScheduleWorkerPO.class)
				.add(Restrictions.eq(GroundLevelingConstructionScheduleWorkerPO.COLUMN_GLCSID_STR, glcsId))
				.add(Restrictions.eq(GroundLevelingConstructionScheduleWorkerPO.COLUMN_WORKERID_STR, workerId))
				.list();
	}

}
