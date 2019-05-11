package com.fanglin.construction.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.construction.dao.ConstructionScheduleDao;
import com.fanglin.construction.po.ConstructionSchedulePO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("constructionScheduleDao")
public class ConstructionScheduleDaoImpl extends DaoImpl<ConstructionSchedulePO> implements ConstructionScheduleDao {

	public ConstructionScheduleDaoImpl(){
		super(ConstructionSchedulePO.class);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<ConstructionSchedulePO> queryConstructionScheduleByOrderId(String orderId) {
		return session().createCriteria(ConstructionSchedulePO.class).add(Restrictions.eq(ConstructionSchedulePO.COLUMN_ORDERID_STR, orderId)).list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<ConstructionSchedulePO> queryConstructionScheduleByCid(Long cid) {
		return session().createCriteria(ConstructionSchedulePO.class).add(Restrictions.eq(ConstructionSchedulePO.COLUMN_CID_STR, cid)).list();
	}

	@Override
	public ConstructionSchedulePO queryConstructionScheduleByOrderId(String orderId, short schedule) {
		return (ConstructionSchedulePO) session().createCriteria(ConstructionSchedulePO.class).add(Restrictions.eq(ConstructionSchedulePO.COLUMN_ORDERID_STR, orderId)).add(Restrictions.eq(ConstructionSchedulePO.COLUMN_SCHEDULE_STR, schedule)).uniqueResult();
	}

	@Override
	public ConstructionSchedulePO queryConstructionScheduleByCid(long cid, short schedule) {
		return (ConstructionSchedulePO) session().createCriteria(ConstructionSchedulePO.class).add(Restrictions.eq(ConstructionSchedulePO.COLUMN_CID_STR, cid)).add(Restrictions.eq(ConstructionSchedulePO.COLUMN_SCHEDULE_STR, schedule)).uniqueResult();
	}
}
