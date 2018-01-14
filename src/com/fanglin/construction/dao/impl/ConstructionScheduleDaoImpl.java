package com.fanglin.construction.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
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
	public List<ConstructionSchedulePO> queryConstructionScheduleByOrderId(String orderId, Short schedule) {
		
		Criteria constructionScheduleList = session().createCriteria(ConstructionSchedulePO.class).add(Restrictions.eq(ConstructionSchedulePO.COLUMN_ORDERID_STR, orderId));
		
		if(schedule != null){
			constructionScheduleList.add(Restrictions.eq(ConstructionSchedulePO.COLUMN_SCHEDULE_STR, schedule));
		}
		
		return constructionScheduleList.list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<ConstructionSchedulePO> queryConstructionScheduleByCid(Long cid, Short schedule) {
		
		Criteria constructionScheduleList = session().createCriteria(ConstructionSchedulePO.class).add(Restrictions.eq(ConstructionSchedulePO.COLUMN_CID_STR, cid));
		
		if(schedule != null){
			constructionScheduleList.add(Restrictions.eq(ConstructionSchedulePO.COLUMN_SCHEDULE_STR, schedule));
		}
		
		return constructionScheduleList.list();
	}
}
