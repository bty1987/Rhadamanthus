package com.fanglin.construction.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.construction.dao.ConstructionDrawingDao;
import com.fanglin.construction.po.ConstructionDrawingPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("constructionDrawingDao")
public class ConstructionDrawingDaoImpl extends DaoImpl<ConstructionDrawingPO> implements ConstructionDrawingDao {

	private ConstructionDrawingDaoImpl(){
		super(ConstructionDrawingPO.class);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<ConstructionDrawingPO> queryConstructionDrawingByCid(Long cid, Short schedule) {
		Criteria constructionlist = session().createCriteria(ConstructionDrawingPO.class).add(Restrictions.eq(ConstructionDrawingPO.COLUMN_CID_STR, cid));
		if(schedule != null){
			constructionlist.add(Restrictions.eq(ConstructionDrawingPO.COLUMN_SCHEDULE_STR, schedule));
		}
		return constructionlist.list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<ConstructionDrawingPO> queryConstructionDrawingByType(Short type) {
		return session().createCriteria(ConstructionDrawingPO.class).add(Restrictions.eq(ConstructionDrawingPO.COLUMN_TYPE_STR, type)).list();
	}


}
