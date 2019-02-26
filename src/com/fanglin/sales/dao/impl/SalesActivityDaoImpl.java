package com.fanglin.sales.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.sales.dao.SalesActivityDao;
import com.fanglin.sales.po.SalesActivityItemPO;

@Repository("salesActivityDao")
public class SalesActivityDaoImpl extends DaoImpl<SalesActivityItemPO> implements SalesActivityDao {
	
	public SalesActivityDaoImpl(){
		super(SalesActivityItemPO.class);
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<SalesActivityItemPO> querySalesActivityItem(String orderId) {
		
		return session().createCriteria(SalesActivityItemPO.class).add(Restrictions.eq(SalesActivityItemPO.COLUMN_ORDERID_STR, orderId)).list();
	}

}
