package com.fanglin.store.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.store.dao.SlideDao;
import com.fanglin.store.po.SlidePO;

@Repository("slideDao")
public class SlideDaoImpl extends DaoImpl<SlidePO> implements SlideDao {

	public SlideDaoImpl() {
		super(SlidePO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<SlidePO> querySlide(Boolean flag) {
		
		Criteria criteria = session().createCriteria(SlidePO.class);
		
		if(flag){
			criteria.add(Restrictions.eq("status", SlidePO.STATUS_ABLE_SHORT));
		}
		
		return criteria.list();
	}

}
