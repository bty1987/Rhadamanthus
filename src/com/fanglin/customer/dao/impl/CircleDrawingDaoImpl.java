package com.fanglin.customer.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.customer.dao.CircleDrawingDao;
import com.fanglin.customer.po.CircleDrawingPO;

@Repository("circleDrawingDao")
public class CircleDrawingDaoImpl extends DaoImpl<CircleDrawingPO> implements CircleDrawingDao{
	
	public CircleDrawingDaoImpl(){
		super(CircleDrawingPO.class);
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<CircleDrawingPO> queryCircleDrawingByCid(long cid) {
		return createCriteria(CircleDrawingPO.class).add(Restrictions.eq(CircleDrawingPO.COLUMN_DCID_STR, cid)).list();
	}

}
